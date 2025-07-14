import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAdmin from '@/components/layout/main-admin';
import Breadcrumb from '@/components/breadcrumb';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import { LoginUser } from '@/types/auth';
import { NextPage } from 'next/types';
import { PageWarehouse, WarehouseView } from '@/types/warehouse';
import { displayNumber, displayTon } from '@/utils/formater';
import Link from 'next/link';
import { PagePurchaseorder, PurchaseorderView } from '@/types/purchaseorder';
import { PageRetail, RetailView } from '@/types/retail';
import { AiOutlineLoading } from 'react-icons/ai';
import { PiFolderOpenDuotone } from 'react-icons/pi';

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {

  const [warehouses, setWarehouses] = useState<WarehouseView[]>([]);
  const [purchaseorders, setPurchaseorders] = useState<PurchaseorderView[]>([]);
  const [retails, setRetails] = useState<RetailView[]>([]);

  const [pageRequestWarehouse, setPageRequestWarehouse] = useState<PageWarehouse>({
    limit: -1,
    page: 1,
    preloads: "Stocks,Stocks.Product,Stocklogs",
  });

  const [pageRequestPurchaseorder, setPageRequestPurchaseorder] = useState<PagePurchaseorder>({
    limit: -1,
    page: 1,
    preloads: "Customer",
  });

  const [pageRequestRetail, setPageRequestRetail] = useState<PageRetail>({
    limit: -1,
    page: 1,
    preloads: "Customer",
  });

  const { isLoading: isLoadingWarehouse, data: dataWarehouse } = useQuery({
    queryKey: ['warehouse', pageRequestWarehouse],
    queryFn: ({ queryKey }) => Api.get('/warehouse', queryKey[1] as object),
  });

  const { isLoading: isLoadingPurchaseorder, data: dataPurchaseorder } = useQuery({
    queryKey: ['purchaseorder', pageRequestPurchaseorder],
    queryFn: ({ queryKey }) => Api.get('/purchaseorder', queryKey[1] as object),
  });

  const { isLoading: isLoadingRetail, data: dataRetail } = useQuery({
    queryKey: ['retail', pageRequestRetail],
    queryFn: ({ queryKey }) => Api.get('/retail', queryKey[1] as object),
  });

  useEffect(() => {
    if (dataWarehouse?.status) {
      setWarehouses(dataWarehouse.payload.list);
    }
  }, [dataWarehouse]);

  useEffect(() => {
    if (dataPurchaseorder?.status) {
      setPurchaseorders(dataPurchaseorder.payload.list);
    }
  }, [dataPurchaseorder]);

  useEffect(() => {
    if (dataRetail?.status) {
      setRetails(dataRetail.payload.list);
    }
  }, [dataRetail]);

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {warehouses.map((data) => {
              return (
                <div key={data.id}>
                  <div className='bg-white p-4 rounded shadow'>
                    <Link href={{ pathname: '/admin/warehouse/[id]', query: { id: data.id } }}>
                      <div className="text-xl font-bold duration-300 text-primary-500 hover:text-primary-400">{data.name}</div>
                    </Link>
                    <hr className="my-4 border-gray-200" />
                    <div className="font-bold">List Stock Product</div>
                    {data.stocks.map((stock) => (
                      <div key={stock.id} className="ml-4 flex justify-between">
                        <div className="">{stock.product.name || stock.id}</div>
                        <div className="">{displayTon(stock.quantity)}</div>
                      </div>
                    ))}
                    <hr className="my-4 border-gray-200" />
                    <div className="font-bold">Runnig Delivery Transfer</div>
                    <div className="ml-4 flex justify-between">
                      <div className="">{"Transfer Out"}</div>
                      <div className="">{displayNumber(data.totalRunningOutbound)}</div>
                    </div>
                    <div className="ml-4 flex justify-between">
                      <div className="">{"Transfer In"}</div>
                      <div className="">{displayNumber(data.totalRunningInbound)}</div>
                    </div>
                    <hr className="my-4 border-gray-200" />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="col-span-1 grid grid-cols-1 gap-4">
            <div className='bg-white p-4 rounded shadow'>
              <div className='text-xl font-bold mb-4'>Purchase Order</div>
              <hr className="my-4 border-gray-200" />
              {isLoadingPurchaseorder ? (
                <div className='h-40 w-full flex justify-center items-center'>
                  <AiOutlineLoading className={'absolute animate-spin '} size={'4rem'} />
                </div>
              ) : (
                <>{purchaseorders.length === 0 ? (
                  <div className='w-full text-center my-8'>
                    <div className='flex justify-center items-center mb-4'>
                      <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                    </div>
                    <div>
                      {'No data found'}
                    </div>
                  </div>
                ) : (
                  <>{purchaseorders.map(purchaseorder => (
                    <div key={purchaseorder.id} className='mb-2 p-2 bg-gray-50'>
                      <div className='font-bold'>{purchaseorder.customer?.name || '-'}</div>
                      <div className='text-sm'>{purchaseorder.number}</div>
                    </div>
                  ))}</>
                )}</>
              )}
            </div>
            <div className='bg-white p-4 rounded shadow'>
              <div className='text-xl font-bold mb-4'>Retail</div>
              <hr className="my-4 border-gray-200" />
              {isLoadingRetail ? (
                <div className='h-40 w-full flex justify-center items-center'>
                  <AiOutlineLoading className={'absolute animate-spin '} size={'4rem'} />
                </div>
              ) : (
                <>{retails.length === 0 ? (
                  <div className='w-full text-center my-8'>
                    <div className='flex justify-center items-center mb-4'>
                      <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                    </div>
                    <div>
                      {'No data found'}
                    </div>
                  </div>
                ) : (
                  <>{retails.map(retail => (
                    <div key={retail.id} className='mb-2 p-2 bg-gray-50'>
                      <div className='font-bold'>{retail.customer?.name || '-'}</div>
                      <div className='text-sm'>{retail.number}</div>
                    </div>
                  ))}</>
                )}</>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAdmin;

export default Index;