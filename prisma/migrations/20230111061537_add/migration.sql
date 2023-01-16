-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
