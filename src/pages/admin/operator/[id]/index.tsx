import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { UserView } from "@/types/user";
import { displayBoolean, displayDate, displayDateTime, displayPhoneNumber } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditUser from "@/components/modal/modal-edit-user";
import ModalEditUserprivilege from "@/components/modal/modal-edit-userprivilege";
import MainAdmin from "@/components/layout/main-admin";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [user, setUser] = useState<UserView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditUser, setShowModalEditUser] = useState<boolean>(false);
  const [showModalEditUserprivilege, setShowModalEditUserprivilege] = useState<boolean>(false);

  const preloads = 'Warehouse,Location,Userprivilege'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/user/' + id, { preloads }) : null
    },
  })

  const toggleModalEditUser = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditUser(!showModalEditUser);
  };

  const toggleModalEditUserprivilege = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditUserprivilege(!showModalEditUserprivilege);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setUser(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Operator Detail'}</title>
      </Head>
      <ModalEditUser
        show={showModalEditUser}
        onClickOverlay={toggleModalEditUser}
        id={selectedId}
      />
      <ModalEditUserprivilege
        show={showModalEditUserprivilege}
        onClickOverlay={toggleModalEditUserprivilege}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Operator', path: '/admin/operator' },
            { name: user?.fullname || id, path: '' },
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
              <div className="mb-8">
                <div className="text-xl flex justify-between items-center mb-2">
                  <div>Operator</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Operator'
                    onClick={() => toggleModalEditUser(user?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-1 sm:col-span-4">{user?.fullname}</div>
                  <div className="text-gray-600">{'Username'}</div>
                  <div className="col-span-1 sm:col-span-4">{user?.username}</div>
                  <div className="text-gray-600">{'Email'}</div>
                  <div className="col-span-1 sm:col-span-4">{user?.email}</div>
                  <div className="text-gray-600">{'Nomor Telepon'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayPhoneNumber(user?.phoneNumber)}</div>
                  <div className="text-gray-600">{'Address'}</div>
                  <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{user?.address || '-'}</div>
                  <div className="text-gray-600">{'Tempat Lahir'}</div>
                  <div className="col-span-1 sm:col-span-4">{user?.birthPlace}</div>
                  <div className="text-gray-600">{'Tanggal Lahir'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDate(user?.birthDt)}</div>
                  <div className="text-gray-600">{'Create By'}</div>
                  <div className="col-span-1 sm:col-span-4">{user?.createName}</div>
                  <div className="text-gray-600">{'Tanggal Buat'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(user?.createDt)}</div>
                  <div className="text-gray-600">{'Last Update By'}</div>
                  <div className="col-span-1 sm:col-span-4">{user?.updateName}</div>
                  <div className="text-gray-600">{'Last Update Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(user?.updateDt)}</div>
                </div>
              </div>
              {user?.warehouse && (
                <div className="mb-8">
                  <div className="text-xl flex justify-between items-center mb-2">
                    <div>Warehouse</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Name'}</div>
                    <div className="col-span-1 sm:col-span-4">{user.warehouse?.name}</div>
                    <div className="text-gray-600">{'Location'}</div>
                    <div className="col-span-1 sm:col-span-4">{user.location?.name}</div>
                  </div>
                </div>
              )}
              {user?.userprivilege && (
                <div className="mb-8">
                  <div className="text-xl flex justify-between items-center mb-2">
                    <div>Privilege</div>
                    <button
                      className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                      type="button"
                      title='Edit Privilege'
                      onClick={() => toggleModalEditUserprivilege(user?.id)}
                    >
                      <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                    <div className="text-gray-600">{'Stock Masuk'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayBoolean(user.userprivilege.stockIn, "Yes", "No")}</div>
                    <div className="text-gray-600">{'Pengiriman Masuk'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayBoolean(user.userprivilege.transferIn, "Yes", "No")}</div>
                    <div className="text-gray-600">{'Pengiriman Keluar'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayBoolean(user.userprivilege.transferOut, "Yes", "No")}</div>
                    <div className="text-gray-600">{'Purchase Order'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayBoolean(user.userprivilege.purchaseorder, "Yes", "No")}</div>
                    <div className="text-gray-600">{'Retail'}</div>
                    <div className="col-span-1 sm:col-span-4">{displayBoolean(user.userprivilege.retail, "Yes", "No")}</div>
                  </div>
                </div>
              )}
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(user, null, 4)}
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