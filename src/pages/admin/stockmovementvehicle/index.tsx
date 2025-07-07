import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import Table from "@/components/table/table";
import { Api } from "@/lib/api";
import { StockmovementvehicleView, PageStockmovementvehicle } from "@/types/stockmovementvehicle";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayDateTime, displayTon } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import { CgChevronDown } from "react-icons/cg";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import ModalFilter from "@/components/modal/modal-filter-stockmovementvehicle";
import MainAdmin from "@/components/layout/main-admin";
import { StockmovementView } from "@/types/stockmovement";

type Props = object

type PropsDropdownMore = {
  toggleModalDelete: (id: string, name: string) => void
}

const DropdownMore: NextPage<CellContext<StockmovementvehicleView, unknown> & PropsDropdownMore> = ({
  row,
  toggleModalDelete,
}) => {
  const refMore = useRef<HTMLDivElement>(null);
  const [moreBar, setMoreBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (moreBar && refMore.current && !refMore.current.contains(e.target)) {
        setMoreBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [moreBar]);

  const handleClickDelete = (id, name) => {
    setMoreBar(false);
    toggleModalDelete(id, name)
  }

  return (
    <div className="relative inline-block py-2 text-right" ref={refMore}>
      <button className="flex justify-center items-center text-primary-500" type="button" onClick={() => setMoreBar(!moreBar)} >
        <div>More</div>
        <CgChevronDown size={'1.2rem'} className={'ml-2'} />
      </button>
      <div className={`z-50 absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white border-2 border-gray-200 focus:outline-none duration-300 ease-in-out ${!moreBar && 'scale-0 shadow-none ring-0'}`}>
        <div className="" role="none">
          <Link href={{ pathname: '/admin/stockmovementvehicle/[id]', query: { id: row.original.id } }}>
            <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'} title='Edit'>
              {'Detail'}
            </div>
          </Link>
          <button onClick={() => handleClickDelete(row.original.id, row.original.number)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Index: NextPage<Props> = () => {

  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView[]>([]);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const [filter, setFilter] = useState<PageStockmovementvehicle>({
    fromWarehouseId: '',
    toWarehouseId: '',
    productId: '',
    vehicleId: '',
    startSentGrossQuantity: '',
    startSentTareQuantity: '',
    startSentNetQuantity: '',
    startSentTime: '',
    startRecivedGrossQuantity: '',
    startRecivedTareQuantity: '',
    startRecivedNetQuantity: '',
    startRecivedTime: '',
    endSentGrossQuantity: '',
    endSentTareQuantity: '',
    endSentNetQuantity: '',
    endSentTime: '',
    endRecivedGrossQuantity: '',
    endRecivedTareQuantity: '',
    endRecivedNetQuantity: '',
    endRecivedTime: '',
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

  const [pageRequest, setPageRequest] = useState<PageStockmovementvehicle>({
    limit: 10,
    page: 1,
    preloads: "Stockmovement,Stockmovement.FromWarehouse,Stockmovement.ToWarehouse",
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
      id: 'stockmovement',
      accessorKey: 'stockmovement',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Destination"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        const stockmovement: StockmovementView = getValue() as StockmovementView
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-number-${row.original.id}`}>{stockmovement?.toWarehouse?.name as string}</span>
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
    {
      id: 'id',
      header: 'Action',
      enableSorting: false,
      enableResizing: false,
      size: 50,
      maxSize: 50,
      cell: (props) => {
        return (
          <DropdownMore
            toggleModalDelete={toggleModalDelete}
            {...props}
          />
        );
      },
    },
  ]

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockmovementvehicle', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockmovementvehicle', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockmovementvehicle/' + id)
  });

  const toggleModalFilter = () => {
    setShowModalFilter(!showModalFilter);
  }

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: ({ status, message }) => {
        if (status) {
          notif.success(message);
          setDeleteId('');
          toggleModalDelete();
          refetch();
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      },
    });
  };

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

  useEffect(() => {
    setPageRequest(removeEmptyValues({
      ...pageRequest,
      ...filter,
      startCreateDt: filter.startCreateDt ? new Date(filter.startCreateDt as string) : '',
      endCreateDt: filter.endCreateDt ? new Date(new Date(filter.endCreateDt as string).setHours(23, 59, 59, 999)) : '',
    }))
  }, [filter])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Stock movement vehicle'}</title>
      </Head>
      <ModalFilter
        show={showModalFilter}
        onClickOverlay={toggleModalFilter}
        filter={filter}
        setFilter={setFilter}
      />
      <ModalDeleteVerify
        show={showModalDelete}
        onClickOverlay={toggleModalDelete}
        onDelete={handleDelete}
        verify={deleteVerify}
        isLoading={isPendingDelete}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDeleteVerify>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Stock movement vehicle', path: '' },
          ]}
        />
        <div className='bg-white mb-20 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-4'>
              <div>
                <div className='text-xl'>{ }</div>
              </div>
              <div className='flex'>
                <div className='ml-4'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 shadow hover:scale-105' onClick={() => toggleModalFilter()}>
                    {isEmptyObject(removeEmptyValues(filter)) ? <TbFilter className='text-primary-500' size={'1.2rem'} /> : <TbFilterFilled className='text-primary-500' size={'1.2rem'} />}
                  </button>
                </div>
                {/* <div className='ml-4'>
                  <Link href={{ pathname: '/admin/stockmovementvehicle/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>New Stockmovementvehicle</div>
                    </div>
                  </Link>
                </div> */}
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={stockmovementvehicle}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAdmin;

export default Index;