export const QueuePrefixKey = '{Queue}';
export const QueueName = {
  BlockchainOrder: 'BlockchainOrder',
  BlockchainMembership: 'BlockchainMembership',
  BlockchainUser: 'BlockchainUser',
};

export const QueueJob = {
  HandleUserCreatedBlockchainJob: `${QueueName.BlockchainUser}::HandleUserCreatedBlockchainJob`,
  HandleUpgradeMembership: `${QueueName.BlockchainMembership}::HandleUpgradeMembership`,
  HandleMarkOrderAsFailed: `${QueueName.BlockchainOrder}::HandleMarkOrderAsFailed`,
};
