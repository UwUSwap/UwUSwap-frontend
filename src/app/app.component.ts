import { Component, OnInit } from '@angular/core';
import Web3 from 'web3';

const web3 = new Web3(window.ethereum); // Dynamically use MetaMask provider

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'UwUSwap';
  web3: Web3;
  contract: any;
  blockNumber = BigInt(-1);
  chainId = BigInt(-1);
  contractAddress = "0x6C87f83c8cA61a8cA93EA394bF1dE4Cc84Ebea53";
  contractABI = [
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_receiver",
          "type": "address"
        }
      ],
      "name": "giveEther",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "num",
          "type": "uint256"
        }
      ],
      "name": "store",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_value",
          "type": "string"
        }
      ],
      "name": "storeText",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "value",
          "type": "string"
        }
      ],
      "name": "StringStored",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_account",
          "type": "address"
        }
      ],
      "name": "checkETHBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLatestStoredText",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieve",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "retrieveAllStoredText",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  showingBalance = BigInt(-1);
  showingAccounts = "0x0";
  showingStoredString = "";
  stringToStore = "";
  allStoredStrings: string[] = [];

  constructor() {
    this.web3 = new Web3(window.ethereum); // Use MetaMask's provider
  }

  async ngOnInit() {
    try {
      await this.initializeContract();
      this.blockNumber = BigInt(await this.web3.eth.getBlockNumber());
      this.chainId = BigInt(await this.web3.eth.getChainId());
      console.log("Initialized successfully!");
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  }

  async initializeContract() {
    this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
  }

  async login() {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.showingAccounts = accounts[0];
      console.log("Logged in:", this.showingAccounts);
      this.showingBalance = BigInt(await this.web3.eth.getBalance(this.showingAccounts));
      this.fetchText();
      this.fetchAllText();
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  async getBalance() {
    try {
      const balance = await this.web3.eth.getBalance(this.showingAccounts);
      this.showingBalance = BigInt(balance);
      console.log("Balance fetched:", this.showingBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  }

  async storeText() {
    try {
      await this.contract.methods['storeText'](this.stringToStore).send({ from: this.showingAccounts });
      console.log("String stored successfully!");
      this.fetchText();
    } catch (error) {
      console.error("Error storing string:", error);
    }
  }

  async fetchText() {
    try {
      const value: string = await this.contract.methods['getLatestStoredText']().call({ from: this.showingAccounts });
      this.showingStoredString = value;
      console.log("Fetched string:", this.showingStoredString);
    } catch (error) {
      console.error("Error fetching string:", error);
    }
  }

  async fetchAllText() {
    try {
      this.allStoredStrings = await this.contract.methods['retrieveAllStoredText']().call({ from: this.showingAccounts });
      console.log("Fetched strings:", this.allStoredStrings);
    } catch (error) {
      console.error("Error fetching strings:", error);
    }
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}
