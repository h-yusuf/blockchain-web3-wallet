import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { FaEthereum, FaBitcoin } from "react-icons/fa";

const timeRanges = [
    { label: "1D", value: "1" },
    { label: "1W", value: "7" },
    { label: "1M", value: "30" },
    { label: "1Y", value: "365" },
    { label: "ALL", value: "max" },
];

function CryptoChart() {
    const [selectedRange, setSelectedRange] = useState("1");
    const [ethData, setEthData] = useState([]);
    const [btcData, setBtcData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [ethRes, btcRes] = await Promise.all([
                    axios.get(
                        `https://api.coingecko.com/api/v3/coins/ethereum/market_chart`,
                        {
                            params: { vs_currency: "usd", days: selectedRange },
                        }
                    ),
                    axios.get(
                        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
                        {
                            params: { vs_currency: "usd", days: selectedRange },
                        }
                    ),
                ]);

                const formatData = (data) =>
                    data.prices.map(([timestamp, price]) => ({
                        time: new Date(timestamp).toLocaleString(),
                        price,
                    }));

                setEthData(formatData(ethRes.data));
                setBtcData(formatData(btcRes.data));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [selectedRange]);

    // Helper for price change badge
    const getChangeBadge = (data) => {
        if (data.length < 2) return null;
        const change = data[data.length - 1].price - data[0].price;
        const percent = ((change / data[0].price) * 100).toFixed(2);
        const isUp = change >= 0;
        return (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold
                ${isUp ? "bg-green-700 text-green-200" : "bg-red-700 text-red-200"}`}>
                {isUp ? "▲" : "▼"} {Math.abs(percent)}%
            </span>
        );
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 rounded-3xl shadow-2xl w-full min-h-screen overflow-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <h2 className="text-4xl font-extrabold tracking-tight flex items-center gap-2">
                    <span className="bg-gradient-to-r from-blue-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent">
                        📊 Crypto Market
                    </span>
                    <span className="text-blue-400"><FaEthereum /></span>
                    <span className="text-yellow-400"><FaBitcoin /></span>
                </h2>
                <div className="flex gap-2">
                    {timeRanges.map((range) => (
                        <button
                            key={range.label}
                            onClick={() => setSelectedRange(range.value)}
                            className={`px-4 py-1 border rounded-lg transition-all duration-200 font-medium shadow
                                ${
                                    selectedRange === range.value
                                        ? "bg-blue-600 border-blue-400 scale-105 shadow-lg"
                                        : "bg-gray-700 border-gray-600 hover:bg-blue-500 hover:border-blue-400"
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="text-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg relative">
                    <div className="absolute top-4 right-4 text-blue-400 text-2xl opacity-30"><FaEthereum /></div>
                    <h3 className="text-xl mb-2 font-bold tracking-wide">Ethereum (ETH)</h3>
                    <p className="text-4xl font-extrabold text-blue-400 flex items-center justify-center">
                        {loading ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            <>
                                ${ethData.length ? ethData[ethData.length - 1].price.toFixed(2) : "--"}
                                {getChangeBadge(ethData)}
                            </>
                        )}
                    </p>
                </div>
                <div className="text-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg relative">
                    <div className="absolute top-4 right-4 text-yellow-400 text-2xl opacity-30"><FaBitcoin /></div>
                    <h3 className="text-xl mb-2 font-bold tracking-wide">Bitcoin (BTC)</h3>
                    <p className="text-4xl font-extrabold text-yellow-400 flex items-center justify-center">
                        {loading ? (
                            <span className="animate-pulse">Loading...</span>
                        ) : (
                            <>
                                ${btcData.length ? btcData[btcData.length - 1].price.toFixed(2) : "--"}
                                {getChangeBadge(btcData)}
                            </>
                        )}
                    </p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-4 shadow-lg">
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart>
                        <XAxis dataKey="time" stroke="#ccc" minTickGap={40} />
                        <YAxis stroke="#ccc" />
                        <Tooltip
                            contentStyle={{ background: "#222", border: "none", borderRadius: "8px" }}
                            labelStyle={{ color: "#fff" }}
                        />
                        <defs>
                            <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#facc15" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#facc15" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <Line
                            type="monotone"
                            dataKey="price"
                            data={btcData}
                            stroke="#facc15"
                            strokeWidth={2.5}
                            name="BTC"
                            dot={false}
                            fill="url(#colorBtc)"
                            fillOpacity={1}
                        />
                        <Line
                            type="monotone"
                            dataKey="price"
                            data={ethData}
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            name="ETH"
                            dot={false}
                            fill="url(#colorEth)"
                            fillOpacity={1}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CryptoChart;
