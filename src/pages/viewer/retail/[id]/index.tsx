import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { RetailView } from "@/types/retail";
import { displayDateTime, displayMoney, displayPhoneNumber, displayTon } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { ImSpinner2 } from 'react-icons/im';
import { RiPencilLine } from "react-icons/ri";
import ModalEditRetail from "@/components/modal/modal-edit-retail";
import MainAdmin from "@/components/layout/main-admin";
import { PageInfo } from "@/types/pagination";
import { PageStockmovementvehicle, StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { ColumnDef, Row } from "@tanstack/react-table";
import Table from "@/components/table/table";
import { ProductView } from "@/types/product";
import { PageTransaction, TransactionView } from "@/types/transaction";
import { Tooltip } from "react-tooltip";
import { VehicleView } from "@/types/vehicle";
import { WarehouseView } from "@/types/warehouse";



type Props = {
  id: string
}

type PropsStockmovementvehicle = {
  id: string
}

type PropsTransaction = {
  id: string
}

const Stockmovementvehicle: NextPage<PropsStockmovementvehicle> = ({ id }) => {
  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView[]>([]);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    relatedId: id,
    preloads: "Vehicle,FromWarehouse,ToWarehouse,Product",
  });

  const RenderStatus: NextPage<{ value: string, row: Row<StockmovementvehicleView> }> = ({ value, row }) => {
    switch (value) {
      case "COMPLETED":
        return (
          <div className='w-full'>
            <span className={"px-2 py-1 rounded-full text-gray-50 bg-green-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
            <Tooltip id={`tootltip-status-${row.original.id}`}>
              <div className="font-bold">{"Status"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex">
                <div className="w-12 font-bold">OPEN</div>
                <div>Operator available to create new delivery</div>
              </div>
              <div className="flex">
                <div className="w-12 font-bold">CLOSE</div>
                <div>Operator unavailable to create new delivery</div>
              </div>
            </Tooltip>
          </div>
        )
      case "LOADING":
        return (
          <div className='w-full'>
            <span className={"px-2 py-1 rounded-full text-gray-50 bg-yellow-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
            <Tooltip id={`tootltip-status-${row.original.id}`}>
              <div className="font-bold">{"Status"}</div>
              <hr className='border-gray-500 border-1 my-2' />
              <div className="flex">
                <div className="w-12 font-bold">OPEN</div>
                <div>Operator available to create new delivery</div>
              </div>
              <div className="flex">
                <div className="w-12 font-bold">CLOSE</div>
                <div>Operator unavailable to create new delivery</div>
              </div>
            </Tooltip>
          </div>
        )
      default:
        return null
    }
  }

  const column: ColumnDef<StockmovementvehicleView>[] = [
    {
      id: 'number',
      accessorKey: 'number',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nomor Pengiriman"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{getValue() as string}</span>
          </div>
        )
      },
    },
    {
      id: 'fromWarehouse',
      accessorKey: 'fromWarehouse',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Sumber"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const fromWarehouse = getValue() as WarehouseView
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{fromWarehouse?.name as string}</span>
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
            {"Driver"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const vehicle: VehicleView = getValue() as VehicleView
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-purhcaseorder-vehicle-${row.original.id}`}>{vehicle?.driverName as string}</span>
            <Tooltip id={`tootltip-purhcaseorder-vehicle-${row.original.id}`}>
              <div className="font-bold">{vehicle?.name}</div>
              <div className="">{vehicle?.driverName}</div>
              <div className="">{displayPhoneNumber(vehicle?.phoneNumber)}</div>
            </Tooltip>
          </div>
        )
      },
    },
    {
      id: 'product',
      accessorKey: 'product',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Product"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const product: ProductView = getValue() as ProductView
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{product?.name as string}</span>
          </div>
        )
      },
    },
    {
      id: 'stockmovementvehicle_status',
      accessorKey: 'stockmovementvehicleStatus',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Status"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <RenderStatus value={getValue() as string} row={row} />
        )
      },
    },
    {
      id: 'sent_net_quantity',
      accessorKey: 'sentNetQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Berat Dikirim"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{displayTon(getValue() as number) || '-'}</span>
          </div>
        )
      },
    },
    // {
    //   id: 'received_net_quantity',
    //   accessorKey: 'receivedNetQuantity',
    //   header: () => {
    //     return (
    //       <div className='whitespace-nowrap'>
    //         {"Berat Diterima"}
    //       </div>
    //     );
    //   },
    //   cell: ({ getValue, row }) => {
    //     return (
    //       <div className='w-full capitalize text-right'>
    //         <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{row.original.status === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
    //       </div>
    //     )
    //   },
    // },
    // {
    //   id: 'shrinkage',
    //   accessorKey: 'shrinkage',
    //   header: () => {
    //     return (
    //       <div className='whitespace-nowrap'>
    //         {"Penyusutan"}
    //       </div>
    //     );
    //   },
    //   cell: ({ getValue, row }) => {
    //     return (
    //       <div className='w-full capitalize text-right'>
    //         <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{row.original.status === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
    //       </div>
    //     )
    //   },
    // },
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

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setStockmovementvehicle(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  return (
    <div className='border-b-2 border-gray-200 mt-8'>
      <div className="text-lg mb-4">Delivery</div>
      <Table
        columns={column}
        data={stockmovementvehicle}
        setPageRequest={setPageRequest}
        pageRequest={pageRequest}
        pageInfo={pageInfo}
        isLoading={isLoading}
      />
    </div>
  )

}

const Transaction: NextPage<PropsTransaction> = ({ id }) => {
  const [transactions, setTransactions] = useState<TransactionView[]>([]);


  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageTransaction>({
    limit: 10,
    page: 1,
    relatedId: id,
    preloads: "Retail",
  });

  const column: ColumnDef<TransactionView>[] = [
    {
      id: 'notes',
      accessorKey: 'notes',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Catatan"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full'>
            <span>{getValue() as string}</span>
          </div>
        )
      },
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Amount"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full text-right'>
            <span>{displayMoney(getValue() as number)}</span>
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

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['transaction', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/transaction', queryKey[1] as object),
  });

  useEffect(() => {
    if (data?.status) {
      setTransactions(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  return (
    <div className='border-b-2 border-gray-200 mt-8'>
      <div className="text-lg mb-4">Transaction</div>
      <Table
        columns={column}
        data={transactions}
        setPageRequest={setPageRequest}
        pageRequest={pageRequest}
        pageInfo={pageInfo}
        isLoading={isLoading}
      />
    </div>
  )
}



const Index: NextPage<Props> = ({ id }) => {
  const [retail, setRetail] = useState<RetailView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditRetail, setShowModalEditRetail] = useState<boolean>(false);

  const preloads = 'Retailproducts'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['retail', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/retail/' + id, { preloads }) : null
    },
  })

  const toggleModalEditRetail = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditRetail(!showModalEditRetail);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setRetail(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Retail Detail'}</title>
      </Head>
      <ModalEditRetail
        show={showModalEditRetail}
        onClickOverlay={toggleModalEditRetail}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Retail', path: '/admin/retail' },
            { name: retail?.number.toString() || id, path: '' },
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
              {retail && (
                <div className="">
                  <div className="mb-4">
                    <div className="text-xl flex justify-between items-center mb-2">
                      <div>Retail</div>
                      <button
                        className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                        type="button"
                        title='Edit Retail'
                        onClick={() => toggleModalEditRetail(retail?.id)}
                      >
                        <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                      <div className="text-gray-600">{'Name'}</div>
                      <div className="col-span-1 sm:col-span-4">{retail?.number}</div>
                      <div className="text-gray-600">{'Catatan'}</div>
                      <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{retail?.notes || '-'}</div>
                      {retail.retailproducts.map((retailproduct) => (
                        <>
                          <div className="text-gray-600">{'Product'}</div>
                          <div className="col-span-1 sm:col-span-4">{retailproduct?.product?.name}</div>
                          <div className="text-gray-600">{'Harga Per Ton'}</div>
                          <div className="col-span-1 sm:col-span-4">{displayMoney(retailproduct?.unitPrice)}</div>
                        </>
                      ))}
                      <div className="text-gray-600">{'Total Price'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayMoney(retail?.totalPrice)}</div>
                      <div className="text-gray-600">{'Total Payment'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayMoney(retail?.totalPayment)}</div>
                      {retail.outstanding > 0 && (
                        <>
                          <div className="text-gray-600">{'Outstanding'}</div>
                          <div className="col-span-1 sm:col-span-4 text-rose-500">{displayMoney(retail?.outstanding)}</div>
                        </>
                      )}
                      <div className="text-gray-600">{'Create By'}</div>
                      <div className="col-span-1 sm:col-span-4">{retail?.createName}</div>
                      <div className="text-gray-600">{'Tanggal Buat'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayDateTime(retail?.createDt)}</div>
                      <div className="text-gray-600">{'Last Update By'}</div>
                      <div className="col-span-1 sm:col-span-4">{retail?.updateName}</div>
                      <div className="text-gray-600">{'Last Update Date'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayDateTime(retail?.updateDt)}</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Stockmovementvehicle id={id} />
                  </div>
                  <div className="mb-4">
                    <Transaction id={id} />
                  </div>
                </div>
              )}
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(retail, null, 4)}
              </div> */}
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