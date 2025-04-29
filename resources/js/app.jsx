import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ethers } from 'ethers';

import Chart from './components/Chart';

function App() {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    const [network, setNetwork] = useState(null);

    async function connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                setAccount(address);

                const userBalance = await provider.getBalance(address);
                setBalance(ethers.formatEther(userBalance));

                const networkInfo = await provider.getNetwork();
                setNetwork(networkInfo.name);
            } catch (err) {
                console.error('User rejected connection:', err);
            }
        } else {
            alert('Metamask tidak ditemukan. Install dulu!');
        }
    }

    async function signMessage() {
        if (!account) {
            alert('Connect wallet dulu!');
            return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const message = "Login into Laravel Web3 App!";
        const signature = await signer.signMessage(message);

        console.log("Signature:", signature);

        await fetch('/api/web3-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify({
                address: account,
                signature: signature,
                message: message
            })
        }).then(res => res.json())
          .then(data => {
              console.log('Login Response:', data);
          }).catch(err => {
              console.error('Login error:', err);
          });
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-900 via-black to-purple-900 flex flex-col items-center justify-center text-white space-y-10 p-6">
            <h1 className="text-5xl font-bold">🚀 Web3 Laravel + React App</h1>

           {/* Chart Crypto */}
           <Chart/>
            {/* Wallet Connection */}
            {account ? (
                <div className="bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <p className="text-lg mb-4"><strong>Wallet Address:</strong><br /> <span className="break-words">{account}</span></p>
                    <p className="text-lg mb-4"><strong>Balance:</strong> {balance} ETH</p>
                    <p className="text-lg mb-6"><strong>Network:</strong> {network}</p>
                    <button 
                        onClick={signMessage}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                    >
                        ✍️ Sign Message (Login)
                    </button>
                </div>
            ) : (
                <button 
                    onClick={connectWallet}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl text-2xl transition-all"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
