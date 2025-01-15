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
  title = 'keyboard2543dapps-ui';
  web3: Web3;
  contract: any;
  blockNumber = BigInt(-1);
  chainId = BigInt(-1);
  contractAddress = "0xa5C7AC4a51A7a0954cA3b81CA94dF1f553Be2B9E";
  contractABI = [
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
      "name": "getValue",
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
      "name": "storeValue",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  showingBalance = BigInt(-1);
  showingAccounts = "0x0";
  showingStoredString = "";
  stringToStore = "";

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
      this.fetchString();
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

  async storeString() {
    try {
      await this.contract.methods['storeValue'](this.stringToStore).send({ from: this.showingAccounts });
      console.log("String stored successfully!");
      this.fetchString();
    } catch (error) {
      console.error("Error storing string:", error);
    }
  }

  async fetchString() {
    try {
      const value: string = await this.contract.methods['getValue']().call({ from: this.showingAccounts });
      this.showingStoredString = value;
      console.log("Fetched string:", this.showingStoredString);
    } catch (error) {
      console.error("Error fetching string:", error);
    }
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}
