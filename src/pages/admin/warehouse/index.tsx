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
import MainAdmin from "@/components/layout/main-admin";
import { AiOutlineLoading } from "react-icons/ai";

type Props = object

const Index: NextPage<Props> = () => {

  const [warehouses, setWarehouses] = useState<WarehouseView[]>([]);

  const [pageRequest, setPageRequest] = useState<PageWarehouse>({
    limit: -1,
    page: 1,
    preloads: "Stocks,Stocks.Product,Stocklogs",
  });

  const { isLoading, data, refetch } = useQuery({
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
          <div className='h-80 w-screen flex justify-center items-center'>
            <AiOutlineLoading className={'absolute animate-spin '} size={'4rem'} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {warehouses.map((data) => {
              return (
                <div key={data.id} className='bg-white p-4 rounded shadow'>
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
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAdmin;

export default Index;