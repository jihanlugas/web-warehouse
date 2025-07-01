import Breadcrumb from "@/components/component/breadcrumb";
import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import { ProductView } from "@/types/product";
import { displayDateTime } from "@/utils/formater";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { RiPencilLine } from "react-icons/ri";
import ModalEditProduct from "@/components/modal/modal-edit-product";
import MainAdmin from "@/components/layout/main-admin";



type Props = {
  id: string
}

const Index: NextPage<Props> = ({ id }) => {


  const [product, setProduct] = useState<ProductView>(null)
  const [selectedId, setSelectedId] = useState<string>('')

  const [showModalEditProduct, setShowModalEditProduct] = useState<boolean>(false);

  const preloads = ''
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['product', id, preloads],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return id ? Api.get('/product/' + id, { preloads }) : null
    },
  })

  const toggleModalEditProduct = (id = '', refresh = false) => {
    if (refresh) {
      refetch()
    }
    setSelectedId(id)
    setShowModalEditProduct(!showModalEditProduct);
  };

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setProduct(data.payload)
      }
    }
  }, [data])

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Product Detail'}</title>
      </Head>
      <ModalEditProduct
        show={showModalEditProduct}
        onClickOverlay={toggleModalEditProduct}
        id={selectedId}
      />
      <div className='p-4'>
        <Breadcrumb
          links={[
            { name: 'Product', path: '/admin/product' },
            { name: product?.name || id, path: '' },
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
                  <div>Product</div>
                  <button
                    className='ml-2 h-8 w-8 flex justify-center items-center duration-300 rounded shadow hover:scale-110'
                    type="button"
                    title='Edit Product'
                    onClick={() => toggleModalEditProduct(product?.id)}
                  >
                    <RiPencilLine className='text-amber-500' size={'1.2rem'} />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                  <div className="text-gray-600">{'Name'}</div>
                  <div className="col-span-1 sm:col-span-4">{product?.name}</div>
                  <div className="text-gray-600">{'Description'}</div>
                  <div className="col-span-1 sm:col-span-4 whitespace-pre-wrap">{product?.description || '-'}</div>
                  <div className="text-gray-600">{'Create By'}</div>
                  <div className="col-span-1 sm:col-span-4">{product?.createName}</div>
                  <div className="text-gray-600">{'Create Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(product?.createDt)}</div>
                  <div className="text-gray-600">{'Last Update By'}</div>
                  <div className="col-span-1 sm:col-span-4">{product?.updateName}</div>
                  <div className="text-gray-600">{'Last Update Date'}</div>
                  <div className="col-span-1 sm:col-span-4">{displayDateTime(product?.updateDt)}</div>
                </div>
              </div>
              {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(product, null, 4)}
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