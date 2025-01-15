import { Component, OnInit } from '@angular/core';
import { Web3 } from 'web3';

const web3 = new Web3('http://localhost:7545');

// For more methods: https://docs.web3js.org/libdocs/Web3Eth

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'keyboard2543dapps-ui';
  blockNumber = BigInt(-1);
  chainId = BigInt(-1);
  contractAddress = "0x9E3241EA3d969f2351A76E3E45B911845Ed62215";
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

  async ngOnInit() {
    this.blockNumber = await web3.eth.getBlockNumber();
    this.chainId = await web3.eth.getChainId();
  }

  showingBalance = BigInt(-1);
  async getBalance() {
    const balance = await web3.eth.getBalance(this.showingAccounts);
    console.log(balance);
    this.showingBalance = BigInt(balance);
  }

  // login with metamask
  showingAccounts = "0x0";
  async login() {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.showingAccounts = accounts[0];
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}
