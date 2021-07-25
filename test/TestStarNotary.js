const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];

    describe('Star Tests Buy Star', function () {
        this.timeout(10000) // all tests in this suite get 10 seconds before timeout

        it('can Create a Star', async() => {
            let tokenId = 1;
            let instance = await StarNotary.deployed();
            await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
            assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
        });

        it('lets user1 put up their star for sale', async() => {
            let instance = await StarNotary.deployed();
            let user1 = accounts[1];
            let starId = 2;
            let starPrice = web3.utils.toWei(".01", "ether");
            await instance.createStar('awesome star', starId, {from: user1});
            await instance.putStarUpForSale(starId, starPrice, {from: user1});
            assert.equal(await instance.starsForSale.call(starId), starPrice);
        });

        it('lets user1 get the funds after the sale', async() => {
            let instance = await StarNotary.deployed();
            let user1 = accounts[1];
            let user2 = accounts[2];
            let starId = 3;
            let starPrice = web3.utils.toWei(".01", "ether");
            let balance = web3.utils.toWei(".05", "ether");
            await instance.createStar('awesome star', starId, {from: user1});
            await instance.putStarUpForSale(starId, starPrice, {from: user1});
            let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
            await instance.approve(user2, starId, {from: user1, gasPrice:0});
            await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
            let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
            let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
            let value2 = Number(balanceOfUser1AfterTransaction);
            assert.equal(value1, value2);
        });

        it('lets user2 buy a star, if it is put up for sale', async() => {
            let instance = await StarNotary.deployed();
            let user1 = accounts[1];
            let user2 = accounts[2];
            let starId = 4;
            let starPrice = web3.utils.toWei(".01", "ether");
            let balance = web3.utils.toWei(".05", "ether");
            await instance.createStar('awesome star', starId, {from: user1});
            await instance.putStarUpForSale(starId, starPrice, {from: user1});
            let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
            await instance.approve(user2, starId, {from: user1});
            await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
            assert.equal(await instance.ownerOf.call(starId), user2);
        });

        it('lets user2 buy a star and decreases its balance in ether', async() => {
            let instance = await StarNotary.deployed();
            let user1 = accounts[1];
            let user2 = accounts[2];
            let starId = 5;
            let starPrice = web3.utils.toWei(".01", "ether");
            let balance = web3.utils.toWei(".05", "ether");
            await instance.createStar('awesome star', starId, {from: user1});
            await instance.putStarUpForSale(starId, starPrice, {from: user1});
            let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
            const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
            await instance.approve(user2, starId, {from: user1});
            await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
            const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
            let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
            assert.equal(value, starPrice);
        });
    });

    describe('Star Tests Task 2 - Exchange Star', function () {
        this.timeout(10000) // all tests in this suite get 10 seconds before timeout

        // Implement Task 2 Add supporting unit tests

        it('can add the star name and star symbol properly', async() => {
            // 1. create a Star with different tokenId
            //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
            let tokenId = 6;
            let instance = await StarNotary.deployed();
            await instance.createStar('Star 6', tokenId, {from: accounts[0]});
            const name = await instance.name();
            const symbol = await instance.symbol();
            assert.equal(name, 'MoonDogeAwesomeStar');
            assert.equal(symbol, 'STAR');
        });

        it('lets 2 users exchange stars', async() => {
            // 1. create 2 Stars with different tokenId
            // 2. Call the exchangeStars functions implemented in the Smart Contract
            // 3. Verify that the owners changed
            let tokenId7 = 7;
            let tokenId8 = 8;
            let user1 = accounts[1];
            let user2 = accounts[2];
            let instance = await StarNotary.deployed();
            await instance.createStar('Star 7!', tokenId7, {from: user1}); 
            await instance.createStar('Star 8!', tokenId8, {from: user2}); 
            await instance.approve(user1, tokenId8, {from: user2});
            await instance.approve(user2, tokenId7, {from: user1});
            await instance.exchangeStars(tokenId7, tokenId8, {from: user1}); 
            const ownerStar7 = await instance.ownerOf(tokenId7); 
            const ownerStar8 = await instance.ownerOf(tokenId8);
            assert.equal(ownerStar7, user2); 
            assert.equal(ownerStar8, user1); 
        });

        it('lets a user transfer a star', async() => {
            // 1. create a Star with different tokenId
            // 2. use the transferStar function implemented in the Smart Contract
            // 3. Verify the star owner changed.
            let tokenId9 = 9;
            let user1 = accounts[1];
            let user2 = accounts[2];
            let instance = await StarNotary.deployed();
            await instance.createStar('Star 9!', tokenId9, {from: user1});    
            await instance.transferStar(user2, tokenId9, {from: user1});
            assert.equal(await instance.ownerOf(tokenId9), user2); 
        });

        it('lookUptokenIdToStarInfo test', async() => {
            // 1. create a Star with different tokenId
            // 2. Call your method lookUptokenIdToStarInfo
            // 3. Verify if you Star name is the same
            let tokenId = 10;
            let instance = await StarNotary.deployed();
            await instance.createStar('Star 10!', tokenId, {from: accounts[0]});
            const starName = await instance.lookUptokenIdToStarInfo(tokenId);
            assert.equal(starName, 'Star 10!');
        });
    });
})