---
title: "Vite Bunny: A Decentralized NFT Marketplace on the Ethereum Blockchain"
author: "[Your Name]"
date: "[Date]"
supervisor: "[Supervisor's Name]"
department: "[Your Department]"
university: "Manipal University Jaipur (MUJ)"
company: "[Company Name, if applicable]"
---

# Vite Bunny: A Decentralized NFT Marketplace on the Ethereum Blockchain

**A Final Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of [Your Degree Name]**

**By**

**[Your Name]**
**[Your Student ID/Enrollment Number]**

**Under the Supervision of**

**[Supervisor's Name]**
**[Supervisor's Designation]**
**[Department Name]**
**Manipal University Jaipur**

**[Company Supervisor Name, if applicable]**
**[Company Supervisor Designation, if applicable]**
**[Company Name, if applicable]**

**[Month, Year]**

---

**(Inner Page - Typically identical to the Cover Page above)**

---

## Dedication (Optional)

*(Optional: Add your dedication here. E.g., "To my family...")*

---

## Student Declaration

I hereby declare that the project work entitled "**Vite Bunny: A Decentralized NFT Marketplace on the Ethereum Blockchain**" submitted to Manipal University Jaipur, is a record of an original work done by me under the guidance of **[Supervisor's Name]**, [Supervisor's Designation], Department of [Department Name], Manipal University Jaipur. This project work is submitted in partial fulfillment of the requirements for the award of the degree of [Your Degree Name].

The results embodied in this report have not been submitted to any other University or Institute for the award of any degree or diploma.

**(Signature)**

**[Your Name]**
**[Your Student ID/Enrollment Number]**
**Date:** [Date]

---

## Certificate from Supervisor (MUJ)

This is to certify that the project report entitled "**Vite Bunny: A Decentralized NFT Marketplace on the Ethereum Blockchain**" submitted by **[Your Name] ([Your Student ID/Enrollment Number])** in partial fulfillment of the requirements for the award of the degree of [Your Degree Name] in [Your Branch/Specialization] at Manipal University Jaipur is an authentic work carried out by him/her under my supervision and guidance.

To the best of my knowledge, the matter embodied in the project report has not been submitted to any other university/institute for the award of any Degree or Diploma.

**(Signature of Supervisor)**

**[Supervisor's Name]**
**[Supervisor's Designation]**
**[Department Name]**
**Manipal University Jaipur**
**Date:** [Date]

---

## Certificate on Company Letterhead

*(Instructions: Insert a scanned copy/image of the certificate provided by the company here, or provide the text content if received via email from the company domain. Ensure the original is retained as per requirements.)*

**[Placeholder for Company Certificate Image or Text]**

---

## Acknowledgement

*(Add your acknowledgements here. Thank your supervisor, university, company (if applicable), colleagues, family, friends, etc.)*

I would like to express my sincere gratitude to my supervisor, **[Supervisor's Name]**, for their invaluable guidance, support, and encouragement throughout this project.

I am also thankful to Manipal University Jaipur and the Department of [Department Name] for providing the necessary facilities and environment for this work.

[Add thanks to company/company supervisor if applicable]

Finally, I wish to thank my family and friends for their constant support and belief in me.

---

## Abstract

This report details the development, implementation, and evaluation of "Vite Bunny," a decentralized NFT (Non-Fungible Token) marketplace built on the Ethereum blockchain. The platform facilitates the creation, listing, purchase, and trading of digital collectibles through secure smart contracts while providing a user-friendly interface powered by Next.js and React. The project involved designing a hybrid architecture combining on-chain Ethereum smart contracts (ERC-721 for NFTs, custom marketplace logic) with off-chain data management using MongoDB. Key implementation aspects included smart contract development in Solidity, frontend development with Next.js, integration with wallet providers (RainbowKit, wagmi), and backend API development for data synchronization between the blockchain and the database. Performance optimization techniques, such as server-side rendering and image optimization, were employed. The report examines the technical architecture, implementation challenges (like gas optimization and data consistency), security considerations, and potential future enhancements for the Vite Bunny platform.

---

## Table of Contents

*(This will be auto-generated or manually filled in based on the final chapter/section headings and page numbers)*

1.  Introduction
    1.1 Background and Motivation
    1.2 Problem Statement
    1.3 Objectives
    1.4 Scope of Work
2.  Literature Review
    2.1 Existing NFT Marketplaces
    2.2 Blockchain Technologies for NFTs
    2.3 Smart Contract Security and Optimization
3.  System Design and Architecture
    3.1 Overview
    3.2 Technology Stack
    3.3 Architecture Diagram
    3.4 Database Schema
4.  Implementation Details
    4.1 Smart Contract Development
    4.2 Frontend Development
    4.3 Backend and API Development
    4.4 Blockchain Integration
    4.5 Deployment
5.  Results and Evaluation
    5.1 Functional Testing
    5.2 Performance Analysis (e.g., Load Times, Gas Costs)
    5.3 Security Assessment
    5.4 Challenges Encountered and Solutions
6.  Conclusion and Future Work
    6.1 Conclusion
    6.2 Future Enhancements
References
Annexures (if any)

---

## List of Figures

*(List all figures used in the report with their captions and page numbers)*

-   Figure 3.1: System Architecture Diagram ...................... [Page Number]
-   Figure 4.1: [Example Figure Caption] ........................ [Page Number]
-   ...

---

## List of Tables

*(List all tables used in the report with their captions and page numbers)*

-   Table 3.1: Technology Stack ................................. [Page Number]
-   Table 5.1: Gas Cost Comparison .............................. [Page Number]
-   ...

---

## Chapter 1: Introduction

### 1.1 Background and Motivation

*(Expand on the background from the abstract/research paper. Discuss the rise of NFTs, blockchain technology, and the need for user-friendly marketplaces.)*
The NFT market has experienced significant growth... Vite Bunny addresses these challenges...

### 1.2 Problem Statement

*(Clearly define the specific problems this project aims to solve. E.g., High gas fees, poor user experience in existing platforms, lack of specific features.)*
Existing NFT marketplaces often suffer from... This project addresses the problem of creating a more accessible, efficient, and secure platform...

### 1.3 Objectives

*(List the specific, measurable, achievable, relevant, and time-bound (SMART) objectives of the project.)*
-   Develop a decentralized NFT marketplace using Ethereum, Next.js, and MongoDB.
-   Implement secure ERC-721 compliant smart contracts for NFT minting and trading.
-   Optimize transaction costs through efficient smart contract design.
-   Create an intuitive user interface for easy navigation and interaction.
-   Ensure real-time synchronization between blockchain events and the off-chain database.
-   Evaluate the platform's performance and security.

### 1.4 Scope of Work

*(Define the boundaries of the project. What features are included? What is excluded?)*
The scope includes user registration (via wallet connection), NFT minting, listing items for sale, purchasing items, and viewing user-specific collections and creations. Features like auctions, bidding, and multi-chain support are considered outside the current scope but are discussed as future work.

---

## Chapter 2: Literature Review

*(Adapt and expand the "Related Work" section from the research paper here. Ensure proper citations.)*

### 2.1 Existing NFT Marketplaces

The emergence of NFT marketplaces... OpenSea... Rarible... Foundation... SuperRare... Our analysis reveals persistent challenges...

### 2.2 Blockchain Technologies for NFTs

The ERC-721 standard... ERC-1155... Layer 2 scaling solutions... Decentralized storage (IPFS)...

### 2.3 Smart Contract Security and Optimization

Security vulnerabilities... Reentrancy attacks... Common vulnerabilities (integer overflow, access control)... Gas optimization techniques... Royalty standards (EIP-2981)...

---

## Chapter 3: System Design and Architecture

### 3.1 Overview

*(Describe the overall architecture - hybrid approach, on-chain vs. off-chain components.)*
Vite Bunny employs a hybrid architecture... combining on-chain smart contracts with off-chain storage and processing...

### 3.2 Technology Stack

*(List the technologies used for frontend, backend, smart contracts, database, infrastructure.)*
-   **Frontend**: Next.js 15, React 19, Tailwind CSS, RainbowKit, wagmi
-   **Smart Contracts**: Solidity 0.8.20, Hardhat, Ethers.js
-   **Backend**: Next.js API routes
-   **Database**: MongoDB
-   **Infrastructure**: Vercel, MongoDB Atlas, Alchemy

### 3.3 Architecture Diagram

*(Insert the architecture diagram from the research paper or an updated version.)*

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   User Browser  │◄──►│  Next.js Front  │◄──►│   MongoDB Atlas │
│                 │    │      End        │    │                 │
└─────────────────┘    └────────┬────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │                 │
                       │    API Routes   │
                       │                 │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │                 │    │                 │
                       │  Ethereum Node  │◄──►│   Smart Contracts│
                       │   (Alchemy)     │    │ (NFT & Mktplace)│
                       └─────────────────┘    └─────────────────┘
```
**Figure 3.1: System Architecture Diagram**

### 3.4 Database Schema

*(Describe the main MongoDB collections and their fields.)*
Key collections in MongoDB:
-   `NFTs`: `_id`, `tokenId`, `nftContract`, `seller`, `owner`, `creator`, `price`, `isListed`, `tokenURI`, `collectionName`, `metadata` (cached from IPFS), `transactionHistory`
-   `Collections`: `_id`, `name`, `description`, `creatorAddress`, `contractAddress`, `symbol`, `coverImage`, `itemCount`, `volumeTraded`
-   `Users`: `_id` (wallet address), `profileImage`, `username`, `bio`, `joinedDate`
-   `Transactions`: `_id`, `type` (Mint, List, Sale, Cancel), `itemId`, `nftContract`, `tokenId`, `fromAddress`, `toAddress`, `price`, `timestamp`, `txHash`

---

## Chapter 4: Implementation Details

*(Describe the implementation of each major component. Include code snippets if appropriate, but keep them concise. Reference Annexures for full code if needed.)*

### 4.1 Smart Contract Development

-   **NFT Contract (ViteBunnyNFT)**: ERC-721 implementation using OpenZeppelin. Key functions: `mintNFT`, `getTokenCreator`, `getTokenCollection`. Custom logic for creator tracking.
-   **Marketplace Contract (ViteBunnyMarketplace)**: Handles listing (`createMarketItem`), buying (`createMarketSale`), cancelling (`cancelMarketItem`). Event emissions (`MarketItemCreated`, `MarketItemSold`). Gas optimization techniques employed (e.g., using mappings over arrays where possible).
-   **Testing**: Used Hardhat for unit testing and deployment scripts.

### 4.2 Frontend Development

-   **Framework**: Next.js for SSR, routing, API routes, and image optimization (`<Image />`).
-   **UI**: Tailwind CSS for styling. Component-based architecture (e.g., `NFTCard`, `WalletConnectButton`).
-   **State Management**: React Context API and custom hooks (`useMarketplace`, `useNFT`).
-   **User Experience**: Responsive design, loading states, error handling.

### 4.3 Backend and API Development

-   **API Routes**: Implemented within Next.js (`pages/api`). Handled requests for fetching NFT/collection data, user profiles, and processing metadata.
-   **Database Interaction**: Used Mongoose ODM to interact with MongoDB Atlas.
-   **Data Synchronization Logic**: Listener service (could be a separate process or triggered by webhooks/polling via API) for blockchain events (`MarketItemCreated`, `MarketItemSold`) to update the MongoDB database in near real-time.

### 4.4 Blockchain Integration

-   **Wallet Connection**: Used RainbowKit and wagmi for multi-wallet support (MetaMask, WalletConnect, etc.) and simplifying interactions.
-   **Contract Interaction**: Ethers.js library used in the frontend (via wagmi hooks) and backend (for event listening/sync) to call contract functions and read data.
-   **Node Provider**: Alchemy used for reliable access to the Ethereum network.

### 4.5 Deployment

-   **Frontend & API**: Deployed on Vercel, leveraging its serverless functions and global CDN.
-   **Smart Contracts**: Deployed to the Ethereum Sepolia testnet (or mainnet if applicable) using Hardhat scripts. Contract addresses configured in environment variables.
-   **Database**: MongoDB Atlas cloud database used.

---

## Chapter 5: Results and Evaluation

*(Present the results of your testing and evaluation.)*

### 5.1 Functional Testing

*(Describe the tests performed to ensure features work as expected. E.g., Can users mint, list, buy? Are collections displayed correctly?)*
Tested key user flows: Wallet connection, NFT minting (including metadata upload to IPFS), listing NFT, purchasing NFT, cancelling listing, viewing owned/created NFTs. All core functionalities were verified on the Sepolia testnet.

### 5.2 Performance Analysis

*(Include metrics like page load times (Core Web Vitals), API response times, transaction confirmation times, and gas cost comparisons if available.)*
-   **Frontend**: Achieved good Core Web Vitals scores via Next.js optimizations (LCP < 2.5s, FID < 100ms).
-   **Gas Costs**: Average gas cost for listing an item was X Gwei, purchasing Y Gwei (provide actual numbers if measured). Compared favourably to baseline implementations due to [mention specific optimization].
-   **API**: Average API response time for fetching NFT details was ~Z ms.

### 5.3 Security Assessment

*(Discuss security measures taken and any audit findings if applicable.)*
-   Used OpenZeppelin contracts for standard security patterns (ReentrancyGuard, Ownable).
-   Input validation implemented on API routes.
-   Rate limiting considered for public API endpoints.
-   [Mention if any formal/informal audits were done and their outcomes].

### 5.4 Challenges Encountered and Solutions

*(Discuss specific technical challenges faced during development and how they were overcome.)*
-   **Challenge**: Real-time database synchronization with blockchain events. **Solution**: Implemented an event listener using Ethers.js connected to Alchemy WebSocket endpoint, processing events and updating MongoDB. Added retry logic for network interruptions.
-   **Challenge**: Optimizing gas costs for marketplace operations. **Solution**: Refactored storage patterns in smart contracts, utilized mappings efficiently.
-   **Challenge**: Handling IPFS pinning and metadata availability. **Solution**: Integrated with Pinata pinning service via API during minting process. Implemented caching of metadata in MongoDB to reduce reliance on IPFS availability for reads.

---

## Chapter 6: Conclusion and Future Work

### 6.1 Conclusion

*(Summarize the project, its achievements, and key findings. Reiterate how objectives were met.)*
This project successfully developed Vite Bunny, a functional decentralized NFT marketplace demonstrating the integration of Next.js, Ethereum smart contracts, and MongoDB. The platform provides core NFT functionalities with considerations for performance and security. The hybrid architecture proved effective in balancing decentralization with user experience and off-chain data management needs. The objectives of creating a user-friendly, secure, and reasonably efficient marketplace were achieved within the defined scope.

### 6.2 Future Enhancements

*(Suggest potential improvements or future features.)*
-   Multi-chain support (Polygon, Solana).
-   Auction and bidding mechanisms.
-   Implementation of EIP-2981 for creator royalties.
-   Advanced filtering and sorting options.
-   User profile customization and social features.
-   Layer 2 scaling integration (e.g., Optimism, Arbitrum) for lower gas fees.
-   Formal security audit.

---

## References

*(List all references cited in the report using a consistent format like APA or IEEE. Use the references from the research paper.)*

1.  Ante, L. (2021). The Non-Fungible Token (NFT) Market and Its Relationship with Bitcoin and Ethereum. SSRN Electronic Journal.
2.  Chen, S., et al. (2021). Gas Optimization Techniques for Ethereum Smart Contracts. [Provide full citation if available]
3.  Chohan, U. W. (2021). Non-Fungible Tokens: Asset Specification, Valuation, and Trading. [Provide full citation if available]
4.  Das, A. (2022). Smart Contract Gas Optimization: Mappings vs Arrays. [Provide full citation if available]
5.  Dowling, M. (2022). Is the Non-Fungible Token Market a Bubble? An Analysis of the NFT Market Around the Beeple Sale. FinTech, 1(1), 47-58.
6.  Entriken, W., Shirley, D., Evans, J., & Sachs, N. (2018). EIP-721: Non-Fungible Token Standard. Ethereum Improvement Proposals.
7.  Ethereum Foundation. (2022). ERC-721 Non-Fungible Token Standard. https://ethereum.org/en/developers/docs/standards/tokens/erc-721/
8.  He, T., & Wang, Y. (2023). NFT Royalty Enforcement: Challenges and Solutions. [Provide full citation if available]
9.  Kang, J., & Hong, S. (2022). Gas Cost Reduction in ERC-721 through Metadata Management. [Provide full citation if available]
10. Lee, D. K. C., & Chuen, D. L. K. (2023). Handbook of Digital Currency: Bitcoin, Innovation, Financial Instruments, and Big Data (2nd ed.). Elsevier.
11. Nadini, M., et al. (2021). Mapping the NFT revolution: market trends, trade networks, and visual features. Scientific Reports, 11(1), 20902.
12. Perez, D., & Livshits, B. (2021). Smart Contract Vulnerabilities: A Large-Scale Study. [Provide full citation if available]
13. Qin, K., et al. (2021). Analyzing Security Vulnerabilities in NFT Smart Contracts. [Provide full citation if available]
14. Samaniego, M., et al. (2022). ERC-1155 vs ERC-721: A Comparative Analysis for Game Items. [Provide full citation if available]
15. Wang, Q., Li, R., Wang, Q., & Chen, S. (2021). Non-Fungible Token (NFT): Overview, Evaluation, Opportunities and Challenges. ArXiv, abs/2105.07447.
16. Wang, Y. (2022). Governance Dynamics in Decentralized Autonomous Organizations: A Case Study of Rarible. [Provide full citation if available]
17. Zheng, P., et al. (2022). The Decentralized Web Stack: An Overview of IPFS and Filecoin. [Provide full citation if available]
18. Zhou, Y., et al. (2022). Empirical Study on the Effectiveness of OpenZeppelin Contracts. [Provide full citation if available]
19. Vercel, Inc. (2023). Next.js Documentation. https://nextjs.org/docs
20. MongoDB Inc. (2023). MongoDB Documentation. https://docs.mongodb.com/
21. Hardhat. (2023). Hardhat Documentation. https://hardhat.org/getting-started/
22. Alchemy. (2023). Alchemy NFT API Documentation. https://docs.alchemy.com/reference/nft-api-quickstart
23. IPFS. (2023). IPFS Documentation. https://docs.ipfs.tech/
24. Ethers.js. (2023). Ethers.js Documentation. https://docs.ethers.org/v5/

*(Ensure you add full citation details where placeholders like "[Provide full citation if available]" exist, if possible. Otherwise, use the available information or web links.)*

---

## Annexures (if any)

*(Optional: Include supplementary materials like full source code snippets, detailed test results, user survey forms, etc.)*

### Annexure A: Smart Contract Code (Key Snippets)

*(Include important functions or structures from ViteBunnyNFT.sol and ViteBunnyMarketplace.sol)*

### Annexure B: API Endpoint Definitions

*(List main API endpoints, their purpose, request/response formats)*

### Annexure C: Detailed Test Cases

*(Table of test cases executed and their results)*

--- 