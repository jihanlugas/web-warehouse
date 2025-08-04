import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { WarehouseView } from "@/types/warehouse";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import MainAdmin from "@/components/layout/main-admin";
import { StockView } from "@/types/stock";
import { displayDateTime, displayTon } from "@/utils/formater";
import { PageStocklog, StocklogView } from "@/types/stocklog";
import { PageInfo } from "@/types/pagination";
import { ColumnDef } from "@tanstack/react-table";
import { removeEmptyValues } from "@/utils/helper";
import Table from "@/components/table/table";
import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { VehicleView } from "@/types/vehicle";



type Props = {
  id: string
}

type PropsStock = {
  stock: StockView
}

const Stock: NextPage<PropsStock> = ({ stock }) => {

  const [stocklog, setStocklog] = useState<StocklogView[]>([]);

  const [filter, setFilter] = useState<PageStocklog>({
    stockmovementId: '',
    stockmovementvehicleId: '',
    productId: '',
    vehicleId: '',
    type: '',
    startGrossQuantity: '',
    startTareQuantity: '',
    startNetQuantity: '',
    endGrossQuantity: '',
    endTareQuantity: '',
    endNetQuantity: '',
    createName: '',
    startCreateDt: '',
    endCreateDt: '',
  })

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageStocklog>({
    limit: 10,
    page: 1,
    preloads: "Vehicle",
    warehouseId: stock.warehouseId,
    stockId: stock.id,
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stocklog', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stocklog', queryKey[1] as object),
  });


  const column: ColumnDef<StocklogView>[] = [
    {
      id: 'type',
      accessorKey: 'type',
      enableSorting: false,
      enableResizing: false,
      size: 50,
      maxSize: 50,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Type"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            {getValue() === "IN" ? (
              <ImArrowDown size={"1rem"} className="text-sky-500" />
            ) : (
              <ImArrowUp size={"1rem"} className="text-rose-500" />
            )}
          </div>
        )
      },
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicle',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Vehicle"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        const vehicle: VehicleView = getValue() as VehicleView
        return (
          <div className='w-full capitalize'>
            <span>{vehicle ? vehicle.name + ' (' + vehicle.plateNumber + ')' : '-'}</span>
          </div>
        )
      },
    },
    {
      id: 'gross_quantity',
      accessorKey: 'grossQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Gross Quantity"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayTon(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'tare_quantity',
      accessorKey: 'tareQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tare Quantity"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayTon(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'net_quantity',
      accessorKey: 'netQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Net Quantity"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayTon(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'current_quantity',
      accessorKey: 'currentQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Current Quantity"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayTon(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'create_dt',
      accessorKey: 'createDt',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Tanggal"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            {displayDateTime(getValue() as string)}
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (data?.status) {
      setStocklog(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  useEffect(() => {
    setPageRequest(removeEmptyValues({
      ...pageRequest,
      ...filter,
      startCreateDt: filter.startCreateDt ? new Date(filter.startCreateDt as string) : '',
      endCreateDt: filter.endCreateDt ? new Date(new Date(filter.endCreateDt as string).setHours(23, 59, 59, 999)) : '',
    }))
  }, [filter])

  return (
    <div>
      <div className="my-4">
        <div className="text-lg text-gray-600 flex">
          <div className="mr-4">{stock.product?.name || stock.id}</div>
          <div className="font-bold mr-4">{displayTon(stock.quantity)}</div>
          </div>
      </div>
      <div className=''>
        <Table
          columns={column}
          data={stocklog}
          setPageRequest={setPageRequest}
          pageRequest={pageRequest}
          pageInfo={pageInfo}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

const Index: NextPage<Props> = ({ id }) => {


  const [warehouse, setWarehouse] = useState<WarehouseView>(null)

  const preloads = 'Stocks,Stocks.Product'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['warehouse', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/warehouse/' + id, { preloads }) : null
    },
  })

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setWarehouse(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Warehouse Detail'}</title>
      </Head>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Warehouse', path: '/admin/warehouse' },
            { name: warehouse?.name || id, path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <div className="py-20">
                <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Stock Product</div>
                </div>
                {warehouse?.stocks.map((stock) => (
                  <Stock key={stock.id} stock={stock} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  return {
    props: {
      id,
    }
  };
};


export default Index;