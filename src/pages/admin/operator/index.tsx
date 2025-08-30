import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import Table from "@/components/table/table";
import { Api } from "@/lib/api";
import { UserView, PageUser } from "@/types/user";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayBoolean, displayPhoneNumber } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useRef, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { CgChevronDown } from "react-icons/cg";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import ModalFilter from "@/components/modal/modal-filter-operator";
import MainAdmin from "@/components/layout/main-admin";
import { USER_ROLE_OPERATOR } from "@/utils/constant";

type Props = object

type PropsDropdownMore = {
  toggleModalDelete: (id: string, name: string) => void
}

const DropdownMore: NextPage<CellContext<UserView, unknown> & PropsDropdownMore> = ({
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
        <div>Lainnya</div>
        <CgChevronDown size={'1.2rem'} className={'ml-2'} />
      </button>
      <div className={`z-50 absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white border-2 border-gray-200 focus:outline-none duration-300 ease-in-out ${!moreBar && 'scale-0 shadow-none ring-0'}`}>
        <div className="" role="none">
          <Link href={{ pathname: '/admin/operator/[id]', query: { id: row.original.id } }}>
            <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'} title='Edit'>
              {'Detail'}
            </div>
          </Link>
          <button onClick={() => handleClickDelete(row.original.id, row.original.fullname)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
            {'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Index: NextPage<Props> = () => {

  const [user, setUser] = useState<UserView[]>([]);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const [filter, setFilter] = useState<PageUser>({
    warehouseId: '',
    fullname: '',
    email: '',
    phoneNumber: '',
    username: '',
    address: '',
    birthPlace: '',
    createName: '',
  })

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageUser>({
    limit: 10,
    page: 1,
    preloads: 'Userprivilege,Warehouse,Warehouse.Location',
    userRole: USER_ROLE_OPERATOR,
  });

  const column: ColumnDef<UserView>[] = [
    {
      id: 'fullname',
      accessorKey: 'fullname',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Operator Name"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        return (
          <div className='w-full capitalize'>
            <span data-tooltip-id={`tootltip-name-${row.original.id}`}>{getValue() as string}</span>
          </div>
        )
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Email"}
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
      id: 'phone_number',
      accessorKey: 'phoneNumber',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Nomor Telepon"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{displayPhoneNumber(getValue() as string)}</span>
          </div>
        )
      },
    },
    {
      id: 'username',
      accessorKey: 'username',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Username"}
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
      id: 'location',
      accessorKey: 'warehouse.location.name',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Location"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{(getValue() as string)}</span>
          </div>
        )
      },
    },
    {
      id: 'warehouse',
      accessorKey: 'warehouse.name',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Warehouse"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{(getValue() as string)}</span>
          </div>
        )
      },
    },
    {
      id: 'stock_in',
      accessorKey: 'userprivilege.stockIn',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Stock Masuk"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{displayBoolean(getValue() as boolean, 'Ya', 'Tidak')}</span>
          </div>
        )
      },
    },
    {
      id: 'transfer_in',
      accessorKey: 'userprivilege.transferIn',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Pengiriman Masuk"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{displayBoolean(getValue() as boolean, 'Ya', 'Tidak')}</span>
          </div>
        )
      },
    },
    {
      id: 'transfer_out',
      accessorKey: 'userprivilege.transferOut',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Pengiriman Keluar"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{displayBoolean(getValue() as boolean, 'Ya', 'Tidak')}</span>
          </div>
        )
      },
    },
    {
      id: 'purchase_order',
      accessorKey: 'userprivilege.purchaseorder',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Purchase Order"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{displayBoolean(getValue() as boolean, 'Ya', 'Tidak')}</span>
          </div>
        )
      },
    },
    {
      id: 'retail',
      accessorKey: 'userprivilege.retail',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Retail"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            <span>{displayBoolean(getValue() as boolean, 'Ya', 'Tidak')}</span>
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
    queryKey: ['user', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/user', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['user', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/user/' + id)
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
      setUser(data.payload.list);
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
        <title>{process.env.APP_NAME + ' - Operator'}</title>
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
          <div className='mb-4'>Apakah anda yakin ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this will also be deleted</div>
        </div>
      </ModalDeleteVerify>
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Operator', path: '/admin/operator' },
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
                  <Link href={{ pathname: '/admin/operator/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>Buat Operator</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={user}
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