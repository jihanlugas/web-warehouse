import Breadcrumb from "@/components/component/breadcrumb";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { PurchaseorderView } from "@/types/purchaseorder";
import { displayDateTime, displayMoney, displayNumber, displayTon } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditPurchaseorder from "@/components/modal/modal-edit-purchaseorder";
import MainAdmin from "@/components/layout/main-admin";
import { PageInfo } from "@/types/pagination";
import { PageStockmovementvehicle, StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { StockmovementView } from "@/types/stockmovement";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import { ProductView } from "@/types/product";
import { PageTransaction, TransactionView } from "@/types/transaction";
import { CustomerView } from "@/types/customer";



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
    preloads: "Stockmovement,Stockmovement.FromWarehouse,Stockmovement.ToWarehouse,Product",
  });

  const column: ColumnDef<StockmovementvehicleView>[] = [
    {
      id: 'number',
      accessorKey: 'number',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Delivery Number"}
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
      id: 'type',
      accessorKey: 'type',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Type"}
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
      id: 'stockmovement',
      accessorKey: 'stockmovement',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Source"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const stockmovement: StockmovementView = getValue() as StockmovementView
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{stockmovement?.fromWarehouse?.name as string}</span>
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
      id: 'status',
      accessorKey: 'status',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Status"}
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
      id: 'sent_net_quantity',
      accessorKey: 'sentNetQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Sent Quantity"}
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
    {
      id: 'recived_net_quantity',
      accessorKey: 'recivedNetQuantity',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Recived Quantity"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{row.original.status === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
          </div>
        )
      },
    },
    {
      id: 'shrinkage',
      accessorKey: 'shrinkage',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Shrinkage"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{row.original.status === 'COMPLETED' ? displayTon(getValue() as number) : '-'}</span>
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
    preloads: "Purchaseorder,Retail",
  });

  const column: ColumnDef<TransactionView>[] = [
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
      id: 'notes',
      accessorKey: 'notes',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Notes"}
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
  const [purchaseorder, setPurchaseorder] = useState<PurchaseorderView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditPurchaseorder, setShowModalEditPurchaseorder] = useState<boolean>(false);

  const preloads = 'Stockmovements,Stockmovements.Product'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['purchaseorder', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/purchaseorder/' + id, { preloads }) : null
    },
  })

  const toggleModalEditPurchaseorder = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditPurchaseorder(!showModalEditPurchaseorder);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setPurchaseorder(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Purchaseorder Detail'}</title>
      </Head>
      <ModalEditPurchaseorder
        show={showModalEditPurchaseorder}
        onClickOverlay={toggleModalEditPurchaseorder}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Purchaseorder', path: '/admin/purchaseorder' },
            { name: purchaseorder?.number.toString() || id, path: '' },
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
              {purchaseorder && (
                <div className="">
                  <div className="mb-4">
                    <div className="text-xl flex justify-between items-center mb-2">
                      <div>Purchaseorder</div>
                      <button
                        className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                        type="button"
                        title='Edit Purchaseorder'
                        onClick={() => toggleModalEditPurchaseorder(purchaseorder?.id)}
                      >
                        <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                      <div className="text-gray-600">{'Name'}</div>
                      <div className="col-span-1 sm:col-span-4">{purchaseorder?.number}</div>
                      <div className="text-gray-600">{'Notes'}</div>
                      <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{purchaseorder?.notes || '-'}</div>
                      {purchaseorder.stockmovements.map((stockmovement) => (
                        <>
                          <div className="text-gray-600">{'Product'}</div>
                          <div className="col-span-1 sm:col-span-4">{stockmovement?.product?.name}</div>
                          <div className="text-gray-600">{'Unit Price'}</div>
                          <div className="col-span-1 sm:col-span-4">{displayMoney(stockmovement?.unitPrice)}</div>
                        </>
                      ))}
                      <div className="text-gray-600">{'Total Price'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayMoney(purchaseorder?.totalPrice)}</div>
                      <div className="text-gray-600">{'Total Payment'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayMoney(purchaseorder?.totalPayment)}</div>
                      {purchaseorder?.outstanding && (
                        <>
                          <div className="text-gray-600">{'Outstanding'}</div>
                          <div className="col-span-1 sm:col-span-4 text-rose-500">{displayMoney(purchaseorder?.outstanding)}</div>
                        </>
                      )}
                      <div className="text-gray-600">{'Create By'}</div>
                      <div className="col-span-1 sm:col-span-4">{purchaseorder?.createName}</div>
                      <div className="text-gray-600">{'Create Date'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayDateTime(purchaseorder?.createDt)}</div>
                      <div className="text-gray-600">{'Last Update By'}</div>
                      <div className="col-span-1 sm:col-span-4">{purchaseorder?.updateName}</div>
                      <div className="text-gray-600">{'Last Update Date'}</div>
                      <div className="col-span-1 sm:col-span-4">{displayDateTime(purchaseorder?.updateDt)}</div>
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
                {JSON.stringify(purchaseorder, null, 4)}
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