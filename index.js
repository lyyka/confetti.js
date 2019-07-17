let confetti_party = undefined;
(function(){

    // set party options
    const options = {
        id: "confetti-canvas",
        fullscreen: true,
        zIndex: 100,
        display: "block",
        shapes: ["triangle", "circle"],
        number: 500,
        speed: 1500,
        wind: 200,
        removeAfterEnd: true,
    };

    // generate a new party
    confetti_party = new ConfettiParty(options);

    document.getElementById('party-start').addEventListener("click", Start);
})();

function Start(){
    if(confetti_party != undefined){
        confetti_party.start();
    }
}