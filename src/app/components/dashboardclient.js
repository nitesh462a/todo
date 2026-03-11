"use client";

import { useState, useEffect } from "react";

export default function CricketScorer() {

  const [team, setTeam] = useState("A");

  const [teamA, setTeamA] = useState({
    overs: [[]],
    bowlers: [""],
    runs: 0,
    wickets: 0
  });

  const [teamB, setTeamB] = useState({
    overs: [[]],
    bowlers: [""],
    runs: 0,
    wickets: 0
  });

  const currentTeam = team === "A" ? teamA : teamB;

  const overs = currentTeam.overs;
  const runs = currentTeam.runs;
  const wickets = currentTeam.wickets;
 const target = team === "B" ? teamA.runs + 1 : null;

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editOver, setEditOver] = useState(null);
  const [showWinner, setShowWinner] = useState(true);
  const [winner, setWinner] = useState(null);

  const [maxWickets, setMaxWickets] = useState(7);
  const [maxOvers, setMaxOvers] = useState(7);


  const [allOut, setAllOut] = useState(false);
  const [oversFinished, setOversFinished] = useState(false);


  /* LOAD DATA AFTER REFRESH */

  useEffect(() => {

    const savedA = localStorage.getItem("teamA");
    const savedB = localStorage.getItem("teamB");
    const savedTeam = localStorage.getItem("team");
    const savedMaxWickets = localStorage.getItem("maxWickets");
    const savedMaxOvers = localStorage.getItem("maxOvers");

    if (savedA) {
      const dataA = JSON.parse(savedA);
      setTeamA({
        ...dataA,
        bowlers: dataA.bowlers || [""]
      });
    }

    if (savedB) {
      const dataB = JSON.parse(savedB);
      setTeamB({
        ...dataB,
        bowlers: dataB.bowlers || [""]
      });
    }
    if (savedTeam) setTeam(savedTeam);

    if (savedMaxWickets) setMaxWickets(Number(savedMaxWickets));
    if (savedMaxOvers) setMaxOvers(Number(savedMaxOvers));

  }, []);

  // winner
useEffect(() => {
  if (winner) return;

  if (team !== "B") return;

  if (teamB.runs >= target) {
    setWinner("Team B Won");
    return;
  }

  if (oversFinished || allOut) {

    if (teamB.runs < teamA.runs) {
      setWinner("Team A Won");
    }
    else if (teamB.runs === teamA.runs) {
      setWinner("Match Draw");
    }

  }

}, [teamB.runs, oversFinished, allOut, team,target]);

  /* SAVE DATA */

  useEffect(() => {

    localStorage.setItem("teamA", JSON.stringify(teamA));
    localStorage.setItem("teamB", JSON.stringify(teamB));
    localStorage.setItem("team", team);

    localStorage.setItem("maxWickets", maxWickets);
    localStorage.setItem("maxOvers", maxOvers);

  }, [teamA, teamB, team, maxWickets, maxOvers]);


  function changeBowler(overIndex, value) {

    if (team === "A") {

      const newBowlers = [...(teamA.bowlers || [])];
      newBowlers[overIndex] = value;

      setTeamA({
        ...teamA,
        bowlers: newBowlers
      });

    } else {

      const newBowlers = [...(teamB.bowlers || [])];
      newBowlers[overIndex] = value;

      setTeamB({
        ...teamB,
        bowlers: newBowlers
      });

    }

  }


  function toggleTeam() {

    if (team === "A") {

      if (oversFinished || allOut) {

        setTeam("B");

        // reset for Team B inning
        setAllOut(false);
        setOversFinished(false);
        setWinner(null);

      } else {
        alert("Team A ka over ya wicket khatam hone do!");
      }

    } else {

      setTeam("A");

    }

  }


function updateTeam(newOvers, newRuns, newWickets) {

  if (team === "A") {

    setTeamA({
      ...teamA,
      overs: newOvers,
      bowlers: teamA.bowlers,
      runs: newRuns,
      wickets: newWickets
    });

  } else {

    setTeamB({
      ...teamB,
      overs: newOvers,
      bowlers: teamB.bowlers,
      runs: newRuns,
      wickets: newWickets
    });

  }

}

  function undoLastBall() {

    if (winner) return;

    let newOvers = JSON.parse(JSON.stringify(overs));
    let newRuns = runs;
    let newWickets = wickets;

    let lastOver = newOvers.length - 1;

    // agar last over empty hai to previous over lo
    if (newOvers[lastOver].length === 0 && newOvers.length > 1) {
      newOvers.pop();
      lastOver = newOvers.length - 1;
    }

    if (lastOver < 0) return;

    if (newOvers[lastOver].length === 0) return;
let lastBall = newOvers[lastOver].pop();

    if (lastBall === "W") newWickets--;
else if (lastBall === "Wd" || lastBall === "Nb") newRuns--;
else if (lastBall === "Nb1") newRuns -= 2;
else if (lastBall === "Nb2") newRuns -= 3;
else if (lastBall === "Nb3") newRuns -= 4;
else if (lastBall === "Nb4") newRuns -= 5;
else if (lastBall === "Nb6") newRuns -= 7;
else if (lastBall === "ro0") newWickets--;
else if (lastBall === "ro1") {
  newRuns--;
  newWickets--;
}
else if (lastBall === "ro2") {
  newRuns -= 2;
  newWickets--;
}
else newRuns -= Number(lastBall);

    updateTeam(newOvers, newRuns, newWickets);
    setAllOut(false);
setOversFinished(false);
setWinner(null);

  }




  function addBall(result) {
    if (winner) return;
    if (allOut || oversFinished) return;

    let newOvers = JSON.parse(JSON.stringify(overs));
    let newRuns = runs;
    let newWickets = wickets;

    if (editOver !== null) {

      let oldValue = newOvers[editOver][editIndex];

      if (oldValue === "W") newWickets--;
      else if (oldValue === "Wd" || oldValue === "Nb") newRuns--;
      else if (oldValue === "ro0") {
        newWickets--;
      }
      else if (oldValue === "ro1") {
        newWickets--;
        newRuns--;
      }
      else if (oldValue === "ro2") {
        newWickets--;
        newRuns -= 2;
      }
      else if (oldValue === "Nb1") newRuns -= 2;
else if (oldValue === "Nb2") newRuns -= 3;
else if (oldValue === "Nb3") newRuns -= 4;
else if (oldValue === "Nb4") newRuns -= 5;
else if (oldValue === "Nb6") newRuns -= 7;



      else newRuns -= Number(oldValue);

     if (result === "W") newWickets++;

else if (result === "Wd" || result === "Nb") newRuns++;

else if (result === "Nb1") newRuns += 2;
else if (result === "Nb2") newRuns += 3;
else if (result === "Nb3") newRuns += 4;
else if (result === "Nb4") newRuns += 5;
else if (result === "Nb6") newRuns += 7;

else if (result === "ro0") newWickets++;

else if (result === "ro1") {
  newRuns += 1;
  newWickets++;
}

else if (result === "ro2") {
  newRuns += 2;
  newWickets++;
}

else newRuns += Number(result);
      newOvers[editOver][editIndex] = result;

      setEditOver(null);
      setEditIndex(null);

    }

    else {

      let currentOver = [...newOvers[newOvers.length - 1]];

      currentOver.push(result);

      newOvers[newOvers.length - 1] = currentOver;

      if (result === "W") newWickets++;
      else if (result === "Wd" || result === "Nb") newRuns++;
      else if (result === "ro0") newWickets++;
      else if (result === "ro1") {
        newRuns += 1;
        newWickets++;
      }
      else if (result === "ro2") {
        newRuns += 2;
        newWickets++;
      }
     else if (result === "Nb1") newRuns += 2;
else if (result === "Nb2") newRuns += 3;
else if (result === "Nb3") newRuns += 4;
else if (result === "Nb4") newRuns += 5;
else if (result === "Nb6") newRuns += 7;
      else newRuns += Number(result);

      let legalBalls = currentOver.filter(
        b => (b !== "Wd" && b !== "Nb"  && b !== "Nb1"  && b !== "Nb2"  && b !== "Nb3"  && b !== "Nb4"  && b !== "Nb6")
      ).length;

      if (legalBalls === 6) {

       if (over + 1 < maxOvers) {
    newOvers.push([]);
  }

        if (team === "A") {
          setTeamA({
            ...teamA,
            overs: newOvers,
            bowlers: [...(teamA.bowlers || []), ""],
            runs: newRuns,
            wickets: newWickets
          });
          setOpen(false);
          return;
        } else {
          setTeamB({
            ...teamB,
            overs: newOvers,
            bowlers: [...(teamB.bowlers || []), ""],
            runs: newRuns,
            wickets: newWickets
          });
          setOpen(false);
          return;
        }
      }

    }

    updateTeam(newOvers, newRuns, newWickets);

    setOpen(false);

  }


  const currentOver = overs[overs.length - 1] || [];

  const legalBalls = overs
  .flat()
  .filter(
    b =>
      b !== "Wd" &&
      b !== "Nb" &&
      b !== "Nb1" &&
      b !== "Nb2" &&
      b !== "Nb3" &&
      b !== "Nb4" &&
      b !== "Nb6"
  ).length;

  const over = Math.floor(legalBalls / 6);

 const ball = legalBalls % 6;

 useEffect(() => {

  if (wickets >= maxWickets && !allOut) {

    setAllOut(true);
    alert("All Out!");

  }

}, [wickets]);

useEffect(() => {

  if (over >= maxOvers && !oversFinished) {

    setOversFinished(true);
    alert("Overs Finished!");

  }

},  [over, maxOvers]);


  function editBall(overIndex, ballIndex) {
    if (winner || oversFinished || allOut) return;

    let lastOver = overs.length - 1;

    if (overs[lastOver].length === 0) {
      lastOver = overs.length - 2;
    }

    let lastBall = overs[lastOver].length - 1;

    if (overIndex === lastOver && ballIndex === lastBall) {
      setEditOver(overIndex);
      setEditIndex(ballIndex);
      setOpen(true);
    }

  }

  function resetMatch() {

    if (confirm("Reset Match?")) {

     setTeamA({
  overs: [[]],
  bowlers: [""],
  runs: 0,
  wickets: 0
});

setTeamB({
  overs: [[]],
  bowlers: [""],
  runs: 0,
  wickets: 0
});
      setTeam("A");

      setAllOut(false);
      setOversFinished(false);
      setWinner(null);
      setMaxWickets(7);
      setMaxOvers(7);
      setShowWinner(true);

      localStorage.removeItem("teamA");
      localStorage.removeItem("teamB");
      localStorage.removeItem("team");
      localStorage.removeItem("maxWickets");
      localStorage.removeItem("maxOvers");

    }

  }


  return (

   <div className="container">


      <button
        onClick={toggleTeam}
        style={{
          padding: "12px 20px",
          background: "#10b981",
          border: "none",
          borderRadius: "8px",
          color: "white",
          margin: "20px"
        }}
      >
        Team {team}
      </button>

      <div style={{
        display: "flex",
        justifyContent: "space-between",

      }}>

        <div >
          Max Wickets :
          <input style={{ width: "2rem", margin: "1rem" }}
            type="number"
            min="1"
            value={maxWickets}
            onChange={(e) => setMaxWickets(Number(e.target.value))}
          />
        </div>

        <div>
          Max Overs :
          <input style={{ width: "2rem", margin: "1rem" }}
            type="number"
            min="1"
            value={maxOvers}
            onChange={(e) => setMaxOvers(Number(e.target.value))}
          />
        </div>

      </div>


      <h1>🏏 Cricket Scorer</h1>

      {winner && (
        <h2 style={{ color: "yellow" }}>
          🏆 {winner}
        </h2>
      )}



      {winner && showWinner && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "#1e40af",
            padding: "40px 60px",
            borderRadius: "15px",
            color: "yellow",
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            boxShadow: "0 0 20px yellow",
            position: "relative"
          }}>
            🏆 {winner}

            <button
              onClick={() => setShowWinner(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "yellow",
                color: "#1e40af",
                border: "none",
                borderRadius: "6px",
                padding: "5px 10px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              X
            </button>
          </div>
        </div>
      )}


      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px"
      }} >
        <h2>Score: {runs}/{wickets}</h2>

        {team === "B" && (
          <h3>Target: {target}</h3>
        )}
      </div>



      <h3>Overs: {over}.{ball}</h3>




      {[...overs].reverse().map((ov, i) => {

        const realOverIndex = overs.length - 1 - i;

        return (

          <div key={i}>

          <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    marginTop: "20px",
    
    marginBottom: "10px",
     border: "2px solid white",
      borderRadius: "6px"
  }}
>
  <h3 style={{ margin: 0 }}>
    Over {realOverIndex + 1} -
  </h3>

  <input
    style={{
      width: "7rem",
      padding: "5px",
     
    }}
    type="text"
    value={currentTeam.bowlers?.[realOverIndex] || ""}
    placeholder="bowler name"
    onChange={(e) => changeBowler(realOverIndex, e.target.value)}
  />
</div>
            <div style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              flexWrap: "wrap"
            }}>

              {ov.map((b, index) => (

                <div
                  key={index}
                  onClick={() => editBall(realOverIndex, index)}
                  style={{
                    width: "45px",
                    height: "45px",
                    background: "#22c55e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  {b}
                </div>

              ))}

            </div>

          </div>

        )

      })}


      {wickets < maxWickets && !oversFinished && (

        <button
          onClick={() => setOpen(true)}
          disabled={winner}
          style={{
            padding: "12px 20px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "8px",
            color: "white",
            position: "fixed",
            top: "10px",
            right: "10px"
          }}
        >
          Add Ball
        </button>

      )}

      <button
        onClick={undoLastBall}
        style={{
          padding: "12px 20px",
          background: "#f59e0b",
          border: "none",
          borderRadius: "8px",
          color: "white",
          position: "fixed",
          top: "70px",
          left: "10px"
        }}
      >
        Undo Ball
      </button>


      <button
        onClick={resetMatch}
        style={{
          padding: "12px 20px",
          background: "#ef4444",
          border: "none",
          borderRadius: "8px",
          color: "white",
          position: "fixed",
          top: "10px",
          left: "10px"
        }}
      >
        Reset Match
      </button>


      {open && (

        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "white",
            padding: "25px",
            borderRadius: "10px",
            color: "black"
          }}>

            <h3>Select Ball Result</h3>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,60px)",
              gap: "10px"
            }}>

              <button onClick={() => addBall(0)}>0</button>
              <button onClick={() => addBall(1)}>1</button>
              <button onClick={() => addBall(2)}>2</button>
              <button onClick={() => addBall(4)}>4</button>
              <button onClick={() => addBall(6)}>6</button>
              <button onClick={() => addBall("W")}>W</button>
              <button onClick={() => addBall("Wd")}>Wd</button>
              <button onClick={() => addBall("Nb")}>Nb</button>
              <button onClick={() => addBall("Nb1")}>Nb1</button>
              <button onClick={() => addBall("Nb2")}>Nb2</button>
              <button onClick={() => addBall("Nb3")}>Nb3</button>
              <button onClick={() => addBall("Nb4")}>Nb4</button>
              <button onClick={() => addBall("Nb6")}>Nb6</button>
              <button onClick={() => addBall("ro0")}>ro0</button>
              <button onClick={() => addBall("ro1")}>ro1</button>
              <button onClick={() => addBall("ro2")}>ro2</button>

            </div>

            <br />

            <button onClick={() => setOpen(false)}>Close</button>

          </div>

        </div>

      )}

    </div>

  );

}