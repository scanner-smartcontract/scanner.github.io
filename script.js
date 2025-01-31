// API Keys
const apiKeys = {
    ethereum: 'YOUR_ETHERSCAN_API_KEY',
    bsc: 'YOUR_BSCSCAN_API_KEY',
    polygon: 'YOUR_POLYGONSCAN_API_KEY'
};

// API Endpoints
const apiEndpoints = {
    ethereum: 'https://api.etherscan.io/api',
    bsc: 'https://api.bscscan.com/api',
    polygon: 'https://api.polygonscan.com/api'
};

async function analyzeToken() {
    const blockchain = document.getElementById('blockchain').value;
    const contractAddress = document.getElementById('contractAddress').value;
    const apiKey = apiKeys[blockchain];
    const apiUrl = apiEndpoints[blockchain];

    if (!contractAddress) {
        document.getElementById('result').innerText = 'Error: Please enter a contract address.';
        return;
    }

    try {
        // Fetch contract source code
        const sourceCodeUrl = `${apiUrl}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;
        const sourceCodeResponse = await fetch(sourceCodeUrl);
        const sourceCodeData = await sourceCodeResponse.json();

        if (sourceCodeData.status !== '1') {
            document.getElementById('result').innerText = 'Error: Unable to fetch contract data.';
            return;
        }

        const contractData = sourceCodeData.result[0];
        let resultText = `Blockchain: ${blockchain.toUpperCase()}\n`;
        resultText += `Contract Name: ${contractData.ContractName}\n`;
        resultText += `Compiler Version: ${contractData.CompilerVersion}\n`;
        resultText += `Optimization Used: ${contractData.OptimizationUsed}\n`;
        resultText += `Is Proxy: ${contractData.Proxy === '1' ? 'Yes' : 'No'}\n`;

        // Basic analysis
        if (contractData.Proxy === '1') {
            resultText += '\nWarning: This contract is a proxy contract. Be cautious!';
        }
        if (contractData.OptimizationUsed === '0') {
            resultText += '\nWarning: Optimization is not enabled. This could indicate poor code quality.';
        }

        // Fetch contract ABI
        const abiUrl = `${apiUrl}?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
        const abiResponse = await fetch(abiUrl);
        const abiData = await abiResponse.json();

        if (abiData.status === '1') {
            resultText += '\n\nABI: Available';
        } else {
            resultText += '\n\nABI: Not available';
        }

        document.getElementById('result').innerText = resultText;
    } catch (error) {
        document.getElementById('result').innerText = 'Error: Unable to connect to the API.';
    }
}
