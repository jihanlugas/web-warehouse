import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import { TransactionView, PageTransaction } from "@/types/transaction";
import PageWithLayoutType from "@/types/layout";
import { displayMoney } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import MainViewer from "@/components/layout/main-viewer";
import { ImSpinner2 } from "react-icons/im";
import { PiFolderOpenDuotone } from "react-icons/pi";

type Props = object


const Index: NextPage<Props> = () => {

  const [transactions, setTransactions] = useState<TransactionView[]>([]);

  const [pageRequest] = useState<PageTransaction>({
    limit: 10,
    page: 1,
    preloads: "Customer,Purchaseorder,Retail",
  });

  const { isLoading, data } = useQuery({
    queryKey: ['transaction', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/transaction', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setTransactions(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Transaction'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Transaction', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <ImSpinner2 className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              {transactions.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-4">
                  {transactions.map((transaction) => {
                    return (
                      <div key={transaction.id} className="p-2 border-l-4 border-gray-400 rounded text-sm shadow">
                        <div className="flex justify-between items-center text-base font-bold mb-2">
                          <div>{transaction.retail?.number || transaction.purchaseorder?.number || '-'}</div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div>Tipe Transaksi</div>
                          <div>{transaction.transactionRelated.replace('_', ' ')}</div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div>Pelanggan</div>
                          <div>{transaction.customer?.name || '-'}</div>
                        </div>
                        <div className="flex justify-between items-center ">
                          <div>Catatan</div>
                          <div>{transaction.notes || '-'}</div>
                        </div>
                        <div className="flex justify-end items-center text-xl font-bold mt-4">
                          <div>{displayMoney(transaction.amount)}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className='w-full text-center my-4'>
                  <div className='flex justify-center items-center mb-4'>
                    <PiFolderOpenDuotone size={'3rem'} className={'text-gray-500'} />
                  </div>
                  <div>
                    {'Data Tidak Ditemukan'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainViewer;

export default Index;