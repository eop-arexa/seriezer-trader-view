db.createUser({
  user: 'admin',
  pwd: 'secret@123',
  roles: [
    {
      role: 'readWrite',
      db: 'arexa-trader-view',
    },
  ],
});
