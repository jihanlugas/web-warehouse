import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import Table from "@/components/table/table";
import { Api } from "@/lib/api";
import { AuditlogView, PageAuditlog } from "@/types/auditlog";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayDateTime } from "@/utils/formater";
import { removeEmptyValues } from "@/utils/helper";
import notif from "@/utils/notif";
import { isEmptyObject } from "@/utils/validate";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import Head from "next/head";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import { TbFilter, TbFilterFilled } from "react-icons/tb";
import ModalFilter from "@/components/modal/modal-filter-auditlog";
import MainAdmin from "@/components/layout/main-admin";
import { WarehouseView } from "@/types/warehouse";

type Props = object

const Index: NextPage<Props> = () => {

  const [auditlogs, setAuditlogs] = useState<AuditlogView[]>([]);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');

  const [filter, setFilter] = useState<PageAuditlog>({
    locationId: '',
    warehouseId: '',
    stockmovementvehicleId: '',
    title: '',
    description: '',
    startCreateDt: '',
    endCreateDt: '',
  })

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageAuditlog>({
    limit: 10,
    page: 1,
    preloads: "Warehouse,Location,Stockmovementvehicle",
  });

  const column: ColumnDef<AuditlogView>[] = [
    {
      id: 'create_name',
      accessorKey: 'createName',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"User"}
          </div>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className='w-full capitalize'>
            {getValue() as string}
          </div>
        )
      },
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Title"}
          </div>
        );
      },
      cell: ({ getValue, row }) => {
        switch (row.original.auditlogType) {
          case "SUCCESS":
            return (
              <div className='w-full capitalize font-bold text-green-500'>
                <span data-tooltip-id={`tootltip-name-${row.original.id}`}>{getValue() as string}</span>
              </div>
            )
          case "FAILED":
            return (
              <div className='w-full capitalize font-bold text-rose-500'>
                <span data-tooltip-id={`tootltip-name-${row.original.id}`}>{getValue() as string}</span>
              </div>
            )
          default:
            return null
        }
      },
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Description"}
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
      id: 'warehouse',
      accessorKey: 'warehouse',
      enableSorting: false,
      header: () => {
        return (
          <div className='whitespace-nowrap'>
            {"Warehouse"}
          </div>
        );
      },  
      cell: ({ getValue }) => {
        const warehouse = getValue() as WarehouseView;
        return (
          <div className='w-full'>
            <span>{warehouse?.name}</span>
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
    queryKey: ['auditlog', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/auditlog', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['auditlog', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/auditlog/' + id)
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
      setAuditlogs(data.payload.list);
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
        <title>{process.env.APP_NAME + ' - Auditlog'}</title>
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
            { name: 'Auditlog', path: '' },
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
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={auditlogs}
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