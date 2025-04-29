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

    useEffect(() => {
        const fetchData = async () => {
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
        };

        fetchData();
    }, [selectedRange]);

    return (
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl w-full h-screen overflow-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-3xl font-semibold">
                    📊 Crypto Market (ETH & BTC)
                </h2>
                <div className="flex gap-2">
                    {timeRanges.map((range) => (
                        <button
                            key={range.label}
                            onClick={() => setSelectedRange(range.value)}
                            className={`px-4 py-1 border rounded-lg ${
                                selectedRange === range.value
                                    ? "bg-blue-600 border-blue-400"
                                    : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                            }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="text-center bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-xl mb-2">Ethereum (ETH)</h3>
                    <p className="text-3xl font-bold text-blue-400">
                        $
                        {ethData.length
                            ? ethData[ethData.length - 1].price.toFixed(2)
                            : "Loading..."}
                    </p>
                </div>
                <div className="text-center bg-gray-800 p-4 rounded-xl">
                    <h3 className="text-xl mb-2">Bitcoin (BTC)</h3>
                    <p className="text-3xl font-bold text-yellow-400">
                        $
                        {btcData.length
                            ? btcData[btcData.length - 1].price.toFixed(2)
                            : "Loading..."}
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart>
                    <XAxis dataKey="time" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="price"
                        data={btcData}
                        stroke="#facc15"
                        strokeWidth={2}
                        name="BTC"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="price"
                        data={ethData}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        name="ETH"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default CryptoChart;
