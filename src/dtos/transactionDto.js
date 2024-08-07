// dtos/transactionDto.js

class CreateTransactionDto {
  constructor(userId, productId, rewardId, amount, transactionType) {
    this.userId = userId;
    this.productId = productId;
    this.rewardId = rewardId;
    this.amount = amount;
    this.transactionType = transactionType;
  }
}

class TransactionResponseDto {
  constructor(id, type, amount, createdAt, details, total) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.createdAt = createdAt;
    this.details = details;
    this.total = total;
  }
}

class ProductTransactionResponseDto {
  constructor(id, user, product, amount, createdAt, total) {
    this.id = id;
    this.user = user;
    this.product = product;
    this.amount = amount;
    this.createdAt = createdAt;
    this.total = total;
  }
}

class RewardTransactionResponseDto {
  constructor(id, user, reward, createdAt) {
    this.id = id;
    this.user = user;
    this.reward = reward;
    this.createdAt = createdAt;
  }
}

module.exports = {
  CreateTransactionDto,
  TransactionResponseDto,
  ProductTransactionResponseDto,
  RewardTransactionResponseDto
};