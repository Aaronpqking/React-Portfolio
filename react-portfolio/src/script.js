var currenttime = moment().format("h:mma");
console.log(currenttime);
var startTime = moment("8:00am", "h:mma").format("h:mma");
console.log(startTime);
var date = moment().format("LLLL");
console.log(date);
document.getElementById("date").innerText = date;
function submit(time) {
    var input = document.getElementById(time).value;
    localStorage.setItem(time, input);
}
console.log(moment().hour());
function write() {


    for (i = 8; i < 18; i++) {
        var display = localStorage.getItem(`${i}`) || " ";
        console.log(i, display);
        console.log(document.getElementById(`${i}`))
        document.getElementById(`${i}`).value = display;

        if (i < currenttime) {
            document.getElementById(`${i}`).disabled = true;
        }
    }
}
function test() { }

