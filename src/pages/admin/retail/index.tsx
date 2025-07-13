import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import Table from "@/components/table/table";
import { Api } from "@/lib/api";
import { RetailView, PageRetail } from "@/types/retail";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayDateTime, displayMoney } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef, Row } from "@tanstack/react-table";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CgChevronDown } from "react-icons/cg";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import ModalFilter from "@/components/modal/modal-filter-retail";
import MainAdmin from "@/components/layout/main-admin";
import ModalRetailTransaction from "@/components/modal/modal-retail-transaction";
import ModalConfirm from "@/components/modal/modal-confirm";
import { Tooltip } from "react-tooltip";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

type Props = object

type PropsDropdownMore = {
  toggleModalDelete: (id: string, name: string) => void
  toggleModalTransaction: (id: string, refresh?: boolean) => void
  toggleModalStatus: (id: string, status: string) => void
}

const DropdownMore: NextPage<CellContext<RetailView, unknown> & PropsDropdownMore> = ({
  row,
  toggleModalDelete,
  toggleModalTransaction,
  toggleModalStatus,
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

  const { mutate: mutateInvoice, isPending: isPendingInvoice } = useMutation({
    mutationKey: ['retail', row.original.id, 'generate-invoice'],
    mutationFn: () => Api.getpdf('/retail/' + row.original.id + "/generate-invoice"),
  })

  const handleClickDelete = (id, name) => {
    setMoreBar(false);
    toggleModalDelete(id, name)
  }

  const handleClickTransaction = (id) => {
    setMoreBar(false);
    toggleModalTransaction(id)
  }

  const generateInvoice = async () => {
    mutateInvoice(null, {
      onError: () => {
        notif.error('Please cek you connection');
      }
    })
  }

  const handleClickStatus = (id, status) => {
    setMoreBar(false);
    toggleModalStatus(id, status)
  }

  const renderStatusButton = () => {
    const { id, status } = row.original;
    if (status === "CLOSE") {
      return (
        <button onClick={() => handleClickStatus(id, status)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
          {'Set Open'}
        </button>
      );
    } else if (status === "OPEN") {
      return (
        <button onClick={() => handleClickStatus(id, status)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
          {'Set Close'}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="relative inline-block py-2 text-right" ref={refMore}>
      <button className="flex justify-center items-center text-primary-500" type="button" onClick={() => setMoreBar(!moreBar)} >
        <div>More</div>
        <CgChevronDown size={'1.2rem'} className={'ml-2'} />
      </button>
      <div className={`z-50 absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white border-2 border-gray-200 focus:outline-none duration-300 ease-in-out ${!moreBar && 'scale-0 shadow-none ring-0'}`}>
        <div className="" role="none">
          {renderStatusButton()}
          <button onClick={() => handleClickTransaction(row.original.id)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Transaction'}
          </button>
          <button onClick={() => generateInvoice()} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            <div className="flex">
              <div className="mr-2">
                {'Invoice'}
              </div>
              {isPendingInvoice && <AiOutlineLoading3Quarters className={'animate-spin text-primary-500'} size={'1rem'} />}
            </div>
          </button>
          <hr className="border-b border-gray-200" />
          <Link href={{ pathname: '/admin/retail/[id]', query: { id: row.original.id } }}>
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

  const [retail, setRetail] = useState<RetailView[]>([]);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalTransaction, setShowModalTransaction] = useState<boolean>(false);
  const [showModalStatus, setShowModalStatus] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string>('');
  const [confirmId, setConfirmId] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const [filter, setFilter] = useState<PageRetail>({
    customerId: '',
    notes: '',
    startTotalPrice: '',
    endTotalPrice: '',
    startTotalPayment: '',
    endTotalPayment: '',
    startOutstanding: '',
    endOutstanding: '',
    startCreateDt: '',
    endCreateDt: '',
  })

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageRetail>({
    limit: 10,
    page: 1,
    preloads: "Customer",
  });

  const RenderStatus: NextPage<{ value: string, row: Row<RetailView> }> = ({ value, row }) => {
    switch (value) {
      case "OPEN":
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
      case "CLOSE":
        return (
          <div className='w-full'>
            <span className={"px-2 py-1 rounded-full text-gray-50 bg-rose-500 text-xs font-bold"} data-tooltip-id={`tootltip-status-${row.original.id}`}>{value}</span>
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

  const column: ColumnDef<RetailView>[] = [
    {
      id: 'number',
      accessorKey: 'number',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Number"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-notes-${row.original.id}`}>{getValue() as string}</span>
            <Tooltip id={`tootltip-notes-${row.original.id}`}>
              <div className="font-bold">{"Notes"}</div>
              <div className="">{row.original.notes ? row.original.notes : '-'}</div>
            </Tooltip>
          </div>
        )
      },
    },
    {
      id: 'customer',
      accessorKey: 'customer.name',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Customer"}
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
      id: 'status',
      accessorKey: 'status',
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
      id: 'total_price',
      accessorKey: 'totalPrice',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Total Price"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayMoney(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'total_payment',
      accessorKey: 'totalPayment',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Total Payment"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
            <span>{displayMoney(getValue() as number)}</span>
          </div>
        )
      },
    },
    {
      id: 'outstanding',
      accessorKey: 'outstanding',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Outstanding"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize text-right'>
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
            toggleModalTransaction={toggleModalTransaction}
            toggleModalStatus={toggleModalStatus}
            {...props}
          />
        );
      },
    },
  ]

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['retail', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/retail', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['retail', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/retail/' + id)
  });

  const { mutate: mutateSetOpen, isPending: isPendingSetOpen } = useMutation({
    mutationKey: ['retail', confirmId, 'set-status-open'],
    mutationFn: (id: string) => Api.get('/retail/' + id + '/set-status-open')
  });

  const { mutate: mutateSetClose, isPending: isPendingSetClose } = useMutation({
    mutationKey: ['retail', confirmId, 'set-status-close'],
    mutationFn: (id: string) => Api.get('/retail/' + id + '/set-status-close')
  });

  const toggleModalFilter = () => {
    setShowModalFilter(!showModalFilter);
  }

  const toggleModalDelete = (id = '', verify = '') => {
    setDeleteId(id);
    setDeleteVerify(verify);
    setShowModalDelete(!showModalDelete);
  };

  const toggleModalTransaction = (id = '', refresh = false) => {
    setSelectedId(id);
    setShowModalTransaction(!showModalTransaction);
    if (refresh) {
      refetch()
    }
  };

  const toggleModalStatus = (id = '', status = '') => {
    setConfirmId(id);
    setStatus(status);
    setShowModalStatus(!showModalStatus);
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

  const handleSetStatus = () => {
    switch (status) {
      case "OPEN":
        mutateSetClose(confirmId, {
          onSuccess: ({ status, message }) => {
            if (status) {
              notif.success(message);
              refetch();
            } else {
              notif.error(message);
            }
            toggleModalStatus();
          },
          onError: () => {
            notif.error('Please cek you connection');
            toggleModalStatus();
          },
        });
        break;
      case "CLOSE":
        mutateSetOpen(confirmId, {
          onSuccess: ({ status, message }) => {
            if (status) {
              notif.success(message);
              refetch();
            } else {
              notif.error(message);
            }
            toggleModalStatus();
          },
          onError: () => {
            notif.error('Please cek you connection');
            toggleModalStatus();
          },
        });
        break;
      default:
        notif.error('Unknown Status');
        toggleModalStatus();
        break;
    }
  }

  useEffect(() => {
    if (data?.status) {
      setRetail(data.payload.list);
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
        <title>{process.env.APP_NAME + ' - Retail'}</title>
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
      <ModalRetailTransaction
        show={showModalTransaction}
        onClickOverlay={toggleModalTransaction}
        id={selectedId}
      />
      <ModalConfirm
        show={showModalStatus}
        onClickOverlay={toggleModalStatus}
        onConfirm={handleSetStatus}
        isLoading={isPendingSetClose || isPendingSetOpen}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Are you sure to change the status</div>
        </div>
      </ModalConfirm>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Retail', path: '' },
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
                <div className='ml-4'>
                  <Link href={{ pathname: '/admin/retail/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>New Retail</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={retail}
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