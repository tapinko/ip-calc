import "./App.css";
import React, { useState } from "react";

const App = () => {
    const [idNetOutput, IDNetOutput] = useState("");
    const [maskOutput, MaskOutput] = useState("");
    const [broadcastOutput, BroadcastOutput] = useState("");
    const [firstUsableOutput, FirstUsableOutput] = useState("");
    const [lastUsableOutput, LastUsableOutput] = useState("");
    const [gatewayOutput, GatewayOutput] = useState("");
    const [numberOfUsableHostsOutput, NumberOfUsableHosts] = useState("");
    const [classIPOutput, ClassIPOutput] = useState("");
    const [classMaskOutput, ClassMaskOutput] = useState("");
    const [autoUpdate, AutoUpdate] = useState(false);

    const [prefixInput, PrefixOutput] = useState(0);
    const [ipAddressInput, IPAddressOutput] = useState("");

    function ipAdressValidation(ip) {
        const ipCorrectSigns = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        return ipCorrectSigns.test(ip);
    }

    function prefixToMask(prefix) {
        var binaryArray = new Array(32).fill(0);

        for (var i = 0; i < prefix; i++) {
            binaryArray[i] = 1;
        }

        var octets = [];
        for (var j = 0; j < 4; j++) {
            var binaryString = binaryArray.slice(j * 8, (j + 1) * 8).join('');
            var octet = parseInt(binaryString, 2);
            octets.push(octet);
        }
        
        return octets.join('.');
    }

    function addHostsToIP(ip, numHosts) {
        var octets = ip.split('.');
        
        var numericIP = (parseInt(octets[0]) << 24) |
                        (parseInt(octets[1]) << 16) |
                        (parseInt(octets[2]) << 8) |
                        parseInt(octets[3]);
        
        var result = numericIP + numHosts;
        
        var newOctets = [
            (result >> 24) & 0xFF,
            (result >> 16) & 0xFF,
            (result >> 8) & 0xFF,
            result & 0xFF
        ];
        
        return newOctets.join('.');
    }

    function whichIPClass(ip) {
        var octets = ip.split('.');

        if (octets[0] <= 127 && octets[3] <= 255) return "A";
        if (octets[0] <= 191 && octets[3] <= 255) return "B";
        if (octets[0] <= 223 && octets[3] <= 255) return "C";
        if (octets[0] <= 239 && octets[3] <= 255) return "D";
        if (octets[0] <= 255 && octets[3] <= 255) return "E";
    }

    function whichMaskClass(prefix) {
        if (prefix <= 8) return "A";
        if (prefix <= 16) return "B";
        if (prefix <= 24) return "C";
        if (prefix <= 32) return "Not defined";
    }

    const updateBtn = () => {
        if (!ipAdressValidation(ipAddressInput)) return;

        const numberOfHosts = Math.pow(2, 32 - prefixInput);

        MaskOutput(prefixToMask(prefixInput));
        IDNetOutput(ipAddressInput);
        NumberOfUsableHosts(numberOfHosts - 3);
        GatewayOutput(addHostsToIP(ipAddressInput, 1));
        FirstUsableOutput(addHostsToIP(ipAddressInput, 2));
        LastUsableOutput(addHostsToIP(ipAddressInput, (numberOfHosts - 2)));
        BroadcastOutput(addHostsToIP(ipAddressInput, (numberOfHosts - 1)));
        ClassIPOutput(whichIPClass(ipAddressInput));
        ClassMaskOutput(whichMaskClass(prefixInput));
    }

    const IPOnChange = (e) => {
        IPAddressOutput(e.target.value);
        if (autoUpdate) updateBtn();
    }

    const prefixOnChange = (e) => {
        PrefixOutput(parseInt(e.target.value));
        if (autoUpdate) updateBtn();
    }
    
    return (
        <div>
            <header>
                <h1>IP calc</h1>
            </header>

            <article>
                <div id="output_container">
                    <div class="output_subcontainer" id="first_output_subcontainer">
                        <span class="output_span_names">ID NET: </span>
                        <span>{idNetOutput}</span>
                    </div>
                    <div class="output_subcontainer">
                        <span class="output_span_names">Gateway: </span>
                        <span>{gatewayOutput}</span>
                    </div> 
                    <div class="output_subcontainer">
                        <span class="output_span_names">First usable: </span>
                        <span>{firstUsableOutput}</span>
                    </div>
                    <div class="output_subcontainer">
                        <span class="output_span_names">Last usable: </span>
                        <span>{lastUsableOutput}</span>
                    </div>
                    <div class="output_subcontainer">
                        <span class="output_span_names">Broadcast: </span>
                        <span>{broadcastOutput}</span>
                    </div>
                    <div class="output_subcontainer">
                        <span class="output_span_names"># of usable hosts: </span>
                        <span>{numberOfUsableHostsOutput}</span>
                    </div>
                    <div class="output_subcontainer">
                        <span class="output_span_names">Mask: </span>
                        <span>{maskOutput}</span>
                    </div>
                    <div class="output_subcontainer">
                        <span class="output_span_names">IP class: </span>
                        <span>{classIPOutput}</span>
                    </div>
                    <div class="output_subcontainer">
                        <span class="output_span_names">Mask class: </span>
                        <span>{classMaskOutput}</span>
                    </div>
                </div>
                <div id="input_container">
                    <form>
                        <span>IP:&nbsp;</span>
                        <input id="inputIP" type="text" placeholder="192.168.0.0" required onChange={IPOnChange} />
                        <span>/</span>
                        <input id="inputPrefix" type="text" placeholder="24" required onChange={prefixOnChange} />
                    </form>
                    <div>
                        <button onClick={updateBtn}>Update</button>
                        <span>Auto update</span>
                        <input id="autoupdate_checkbox" type="checkbox" onChange={(e) => AutoUpdate(e.target.value)} />
                    </div>
                </div>
            </article>
        </div>
    )
}

export default App