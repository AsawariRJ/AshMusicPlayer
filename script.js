
//Get songs

function formatSeconds(seconds) {
    // Ensure seconds is an integer
    seconds = Math.floor(seconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros if necessary
    const minutesFormatted = minutes.toString().padStart(2, '0');
    const secondsFormatted = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted time string
    return `${minutesFormatted}:${secondsFormatted}`;
}
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs;

}
let songs;
let currentSong = new Audio;
const playMusic = (track) => {
    //let audio=new Audio("/songs/"+track);
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "images/pause.svg";
    document.querySelector(".songInfo").innerHTML = track
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00"

}

async function main() {

    songs = await getSongs();
    console.log(songs);

    //play the first song
    var audio = new Audio(songs[0]);
    //audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration, audio.src, audio.currentTime);

    });
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="images/music.svg" alt="">
                            <div class="info">
                                <div class="songName">${song.replaceAll("%20", " ")}</div>
                                <div class="artist">Ash</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert pn" src="images/playnow.svg" alt="">
                            </div></li> `;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })

    })
    //attach an eventlistner to play, next, prev
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "images/play.svg"
        }
    })

    //Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML = formatSeconds(currentSong.currentTime) + " / " + formatSeconds(currentSong.duration)
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //add an eventlistener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        console.log(e.offsetX);
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentSong.currentTime = (currentSong.duration * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100
    })
    document.querySelector(".songTime").style.color = "black";
    document.querySelector(".songInfo").style.color = "black";


    //add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {

        console.log("Im clicked");
        document.querySelector(".left").style.left = "0";
        document.querySelector(".left").addEventListener("click", () => {
            console.log("Im clicked");
            document.querySelector(".left").style.left = "-120%";
        })

    }

    )


    //add an event listener to prev and next

    prev.addEventListener("click",()=>{
        console.log("clicked next song")
        console.log(songs);
        let index= songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        console.log(songs,index)
        if ((index-1)>=0)
            playMusic(songs[index-1]);

    }
    
    )
    next.addEventListener("click",()=>{
        console.log("clicked next song")
        console.log(songs);
        let index= songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
        console.log(songs,index)
        if ((index+1)>length)
            playMusic(songs[index+1]);

    }
    
    )

}
main()

