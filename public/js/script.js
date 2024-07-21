const socket= io();

if(navigator.geolocation)
{
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude}= position.coords;
        socket.emit("send-location", {latitude, longitude});
    }, 
    (error)=>{
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeOut: 5000
    }
);
}

const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Suyash Sharma'
}).addTo(map);

let markers={};

socket.on("Received location:", (data)=>{
    const{id, latitude, longitude}= data;
    map.setView([latitude, longitude]);

    if(markers[id])
    {
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id]=L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", (id)=>{
    if(map[id])
    {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})
