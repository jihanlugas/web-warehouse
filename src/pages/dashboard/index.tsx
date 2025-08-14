import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import Breadcrumb from '@/components/breadcrumb';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import MainOperator from '@/components/layout/main-operator';
import { NextPage } from 'next/types';
import { WarehouseView } from '@/types/warehouse';
import { LoginUser } from '@/types/auth';
import Link from 'next/link';
import { displayTon, displayNumber } from '@/utils/formater';
import { data } from 'autoprefixer';
import { AiOutlineLoading } from 'react-icons/ai';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {

  const [warehouse, setWarehouse] = useState<WarehouseView>();

  const preloads = "Stocks,Stocks.Product,Stocklogs"
  const { isLoading: isLoadingWarehouse, data: dataWarehouse } = useQuery({
    queryKey: ['warehouse', loginUser.user.warehouseId],
    queryFn: () => Api.get('/warehouse/' + loginUser.user.warehouseId, { preloads }),
  });

  useEffect(() => {
    if (dataWarehouse?.status) {
      setWarehouse(dataWarehouse.payload);
    }
  }, [dataWarehouse]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Dashboard'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Dashboard', path: '' },
          ]}
        />
        {isLoadingWarehouse ? (
          <div className='h-40 w-full flex justify-center items-center'>
            <AiOutlineLoading className={'absolute animate-spin '} size={'4rem'} />
          </div>
        ) : (
          <>{warehouse && (
            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className='bg-white p-4 rounded shadow'>
                <div className="">
                  <div className="text-lg font-bold">{warehouse.name}</div>
                  <hr className="my-4 border-gray-200" />
                  <div className='ml-4 my-2'>
                    <div className='font-bold'>Stock</div>
                    {warehouse.stocks.map((stock) => (
                      <div key={stock.id} className="flex justify-between">
                        <div className="">{stock.product.name || stock.id}</div>
                        <div className="font-bold">{displayTon(stock.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div className='ml-4 my-2 flex justify-between'>
                    <div className='font-bold'>Pengiriman Barang</div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='flex items-center justify-start'>
                        <ImArrowDown size={"1rem"} className="text-sky-500 mr-2" />
                        <div className="">{displayNumber(warehouse.totalRunningTransferin)}</div>
                      </div>
                      <div className='flex items-center justify-start'>
                        <ImArrowUp size={"1rem"} className="text-rose-500 mr-2" />
                        <div className="">{displayNumber(warehouse.totalRunningTransferout)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}</>
        )}
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainOperator;

export default Index;