import Breadcrumb from "@/components/component/breadcrumb";
import ModalDeleteVerify from "@/components/modal/modal-delete-verify";
import { Api } from "@/lib/api";
import { StockinView, PageStockin } from "@/types/stockin";
import PageWithLayoutType from "@/types/layout";
import { displayDateTime, displayTon } from "@/utils/formater";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next/types"
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import MainOperator from "@/components/layout/main-operator";
import moment from "moment";
import { PiFolderOpenDuotone } from "react-icons/pi";

type Props = object


const Index: NextPage<Props> = () => {


  const [stockin, setStockin] = useState<StockinView[]>([]);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [deleteVerify, setDeleteVerify] = useState<string>('');


  const [pageRequest] = useState<PageStockin>({
    limit: -1,
    startCreateDt: moment().subtract(2, 'days').toISOString(), // 2 days ago
    preloads: "Product",
  });

  const { isLoading, data, refetch } = useQuery({
    queryKey: ['stockin', pageRequest],
    queryFn: ({ queryKey }) => Api.get('/stockin', queryKey[1] as object),
  });

  const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
    mutationKey: ['stockin', 'delete', deleteId],
    mutationFn: (id: string) => Api.delete('/stockin/' + id)
  });

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
      setStockin(data.payload.list);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Stockin'}</title>
      </Head>
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
            { name: 'Stockin', path: '' },
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
                  <Link href={{ pathname: '/stockin/new' }}>
                    <div className='w-60 h-10 bg-primary-500 hover:bg-primary-600 rounded mb-4 text-gray-50 font-bold flex justify-center items-center duration-300 hover:scale-105'>
                      <BiPlus className='mr-2' size={'1.5rem'} />
                      <div>New Stockin</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div>
              {isLoading ? (
                <div>Loading</div>
              ) : (
                <div>
                  {stockin.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {stockin.map((data, key) => (
                        <div key={key} className="shadow p-4 rounded bg-gray-50 border-l-4 border-l-primary-400">
                          <div className="text-lg">{data?.product?.name}</div>
                          <div className="">{displayTon(data.netQuantity)}</div>
                          <hr className="my-2 border-gray-200" />
                          <div className="text-sm">{data.remark}</div>
                          <div className="text-sm text-right mt-4">
                            <div className="">{displayDateTime(data.createDt)}</div>
                            <div className="">{data.createName}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='w-full text-center my-16'>
                      <div className='flex justify-center items-center mb-4'>
                        <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                      </div>
                      <div className="text-xl">{'No data found'}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

(Index as PageWithLayoutType).layout = MainOperator;

export default Index;