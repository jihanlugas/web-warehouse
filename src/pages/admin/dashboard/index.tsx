import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import MainAdmin from '@/components/layout/main-admin';
import Breadcrumb from '@/components/breadcrumb';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import { LoginUser } from '@/types/auth';
import { NextPage } from 'next/types';
import { displayNumber, displayTon } from '@/utils/formater';
import { PagePurchaseorder, PurchaseorderView } from '@/types/purchaseorder';
import { PageRetail, RetailView } from '@/types/retail';
import { AiOutlineLoading } from 'react-icons/ai';
import { LocationView, PageLocation } from '@/types/location';
import { ImArrowDown, ImArrowUp } from 'react-icons/im';
import { PageProduct, ProductView } from '@/types/product';
import Link from 'next/link';

type Props = {
  loginUser: LoginUser
}

const Index: NextPage<Props> = ({ loginUser }) => {

  const [locations, setLocations] = useState<LocationView[]>([]);
  const [purchaseorders, setPurchaseorders] = useState<PurchaseorderView[]>([]);
  const [retails, setRetails] = useState<RetailView[]>([]);
  const [products, setProducts] = useState<ProductView[]>([]);

  const [pageRequestLocation] = useState<PageLocation>({
    limit: -1,
    page: 1,
    preloads: "Warehouses,Warehouses.Stocks,Warehouses.Stocks.Product",
  });

  const [pageRequestPurchaseorder] = useState<PagePurchaseorder>({
    limit: -1,
    page: 1,
    preloads: "Customer",
  });

  const [pageRequestRetail] = useState<PageRetail>({
    limit: -1,
    page: 1,
    preloads: "Customer",
  });

  const [pageRequestProduct] = useState<PageProduct>({
    limit: -1,
    page: 1,
    preloads: "",
  });

  const { isLoading: isLoadingLocation, data: dataLocation } = useQuery({
    queryKey: ['location', pageRequestLocation],
    queryFn: ({ queryKey }) => Api.get('/location', queryKey[1] as object),
  });

  const { isLoading: isLoadingPurchaseorder, data: dataPurchaseorder } = useQuery({
    queryKey: ['purchaseorder', pageRequestPurchaseorder],
    queryFn: ({ queryKey }) => Api.get('/purchase-order', queryKey[1] as object),
  });

  const { isLoading: isLoadingRetail, data: dataRetail } = useQuery({
    queryKey: ['retail', pageRequestRetail],
    queryFn: ({ queryKey }) => Api.get('/retail', queryKey[1] as object),
  });

  const { isLoading: isLoadingProduct, data: dataProduct } = useQuery({
    queryKey: ['product', pageRequestProduct],
    queryFn: ({ queryKey }) => Api.get('/product', queryKey[1] as object),
  });

  useEffect(() => {
    if (dataLocation?.status) {
      setLocations(dataLocation.payload.list);
    }
  }, [dataLocation]);

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

  useEffect(() => {
    if (dataProduct?.status) {
      setProducts(dataProduct.payload.list);
    }
  }, [dataProduct]);

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
        {isLoadingLocation || isLoadingPurchaseorder || isLoadingRetail || isLoadingProduct ? (
          <div className='h-40 w-full flex justify-center items-center'>
            <AiOutlineLoading className={'absolute animate-spin '} size={'4rem'} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {locations.map((data) => {
              const locationStock = [];
              products.forEach((product) => {
                locationStock.push({ id: product.id, name: product.name, quantity: 0 });
              });
              data.warehouses.forEach((warehouse) => {
                warehouse.stocks.forEach((stock) => {
                  const found = locationStock.find((item) => item.id === stock.product.id);
                  if (found) {
                    found.quantity += stock.quantity;
                  } else {
                    locationStock.push({
                      id: stock.product.id,
                      quantity: stock.quantity,
                    });
                  }
                });
              });
              return (
                <div key={data.id}>
                  <div className='bg-white p-4 rounded shadow'>
                    <div className="text-xl font-bold">{data.name}</div>
                    {locationStock.map((stock) => (
                      <div key={stock.id} className="flex justify-between">
                        <div className="">{stock.name || stock.id}</div>
                        <div className="font-bold">{displayTon(stock.quantity)}</div>
                      </div>
                    ))}
                    <hr className="my-4 border-gray-200" />
                    {data.warehouses.map((warehouse) => (
                      <div key={warehouse.id} className="my-4">
                        <Link href={{ pathname: '/admin/warehouse/[id]', query: { id: warehouse.id } }}>
                          <div className="text-xl font-bold duration-300 text-primary-500 hover:text-primary-400">{warehouse.name}</div>
                        </Link>
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
                        <hr className="my-4 border-gray-200" />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAdmin;

export default Index;