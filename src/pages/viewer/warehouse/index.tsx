import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import { WarehouseView, PageWarehouse } from "@/types/warehouse";
import PageWithLayoutType from "@/types/layout";
import { displayNumber, displayTon } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import MainViewer from "@/components/layout/main-viewer";
import { AiOutlineLoading } from "react-icons/ai";
import { ImArrowDown, ImArrowUp, ImSpinner2 } from "react-icons/im";

type Props = object

const Index: NextPage<Props> = () => {

  const [warehouses, setWarehouses] = useState<WarehouseView[]>([]);

  const [pageRequest] = useState<PageWarehouse>({
    limit: -1,
    page: 1,
    preloads: "Stocks,Stocks.Product,Stocklogs",
  });

  const { isLoading, data } = useQuery({
    queryKey: ['warehouse', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/warehouse', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setWarehouses(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Warehouse'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Warehouse', path: '' },
          ]}
        />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <ImSpinner2 className={'animate-spin text-blue-500'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {warehouses.map((warehouse) => {
              return (
                <div key={warehouse.id} className='bg-white p-4 rounded shadow'>
                  <div className="">
                    <Link href={{ pathname: '/viewer/warehouse/[id]', query: { id: warehouse.id } }}>
                      <div className="text-xl font-bold duration-300 text-primary-500 hover:text-primary-400">{warehouse.name}</div>
                    </Link>
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
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainViewer;

export default Index;