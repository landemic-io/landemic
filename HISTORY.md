# History

## Prep Work

- Solidity source code; the `id` field was a natural fit for Google Plus Codes
- Gamification concepts such as giving people royalties when others buy tiles — lots of financial innovation
- Adjusted the product in anticipation of technical challenges ahead, so product-thinking applied end-to-end
- Truffle Suite / Ganache used to create a local blockchain

## Early Phase (0 tiles, 8 Ukrainian developers)

- With zero tiles and users, easy to have users communicate directly with the blockchain
- React/Redux used to synchronize state with the chain
- Buying tiles directly through the chain, while still showing feedback to the user
- Rendering challenges with zooming out and displaying tiles — closer to graphics programming / compression
- Heavy front-end work for all features: buying popups, etc.
- Contract auditing
- Contract updates such as logic to prevent malicious buyers
- Terraform infrastructure to compile the Solidity contract, deploy to testnet, and update the front-end — necessary because every contract change resets the whole project
- Unit tests for the smart contract on testnet

## Initial Release Phase (1,000 tiles)

- Browser performance started bogging down, so caching of the raw chain was introduced
- Pushed the limits as users wanted to buy multiple tiles at once — optimized how much could be packed into a transaction
- Contract migration work in Solidity to support multi-tile purchases — difficult
- Hard to test throughout: costs real money, so the pipeline was local → testnet → production with bug fixes at each stage

## Later Releases (10,000 tiles)

- Migrated away from the original setup once contract iteration slowed
- API freebie era ended, requiring a separate server to cache chain metadata independently
- Added caching for rankings and leaderboard for better efficiency
- Cost reduction work: squeezing every advantage out of Vercel and Heroku
- Open-sourced the project so anyone can one-click spin it up — a clarifying exercise
