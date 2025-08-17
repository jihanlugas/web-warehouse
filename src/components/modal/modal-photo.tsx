import { NextPage } from "next/types";
import Modal from "./modal";
import { IoClose } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useEffect, useState } from "react";
import { StockmovementvehicleView } from "@/types/stockmovementvehicle";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiFolderOpenDuotone } from "react-icons/pi";
import ButtonSubmit from "../formik/button-submit";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import ImageField from "../formik/image-field";
import * as Yup from 'yup';
import { CreateStockmovementvehiclephoto } from "@/types/stockmovementvehiclephoto";
import notif from "@/utils/notif";
import { LoginUser } from "@/types/auth";
import DisplayImage from "@/components/component/image";
import { displayDateTime } from "@/utils/formater";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
  allowAdd?: boolean
}

const schema = Yup.object().shape({

});

const defaultInitFormikValue: CreateStockmovementvehiclephoto = {
  warehouseId: '',
  stockmovementvehicleId: '',
  photo: null,
}

const ModalPhoto: NextPage<Props> = ({ show, onClickOverlay, id, allowAdd }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [stockmovementvehicle, setStockmovementvehicle] = useState<StockmovementvehicleView>()
  const [loginUser, setLoginUser] = useState<LoginUser>();

  const [initFormikValue] = useState<CreateStockmovementvehiclephoto>(defaultInitFormikValue)


  const { data: dataLoginUser } = useQuery({
    queryKey: ['init'],
    queryFn: () => Api.get('/auth/init'),
  })


  const preloads = 'Stockmovementvehiclephotos,Stockmovementvehiclephotos.Warehouse'
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['stockmovementvehicle', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/stockmovementvehicle/' + selectedId, { preloads }) : null
    },
  })


  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['customer', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.postimage('/stockmovementvehicle/' + selectedId + '/upload-photo', val),
  });

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
      setStockmovementvehicle(null)
    }
  }, [show, id])


  useEffect(() => {
    if (data) {
      if (data?.status) {
        setStockmovementvehicle(data.payload)
      } else {
        setStockmovementvehicle(null)
      }
    }
  }, [data])

  useEffect(() => {
    if (dataLoginUser?.status) {
      setLoginUser(dataLoginUser?.payload)
    }
  }, [dataLoginUser])

  const handleSubmit = async (values: CreateStockmovementvehiclephoto, formikHelpers: FormikHelpers<CreateStockmovementvehiclephoto>) => {
    values.stockmovementvehicleId = selectedId
    values.warehouseId = loginUser?.user?.warehouseId || ''

    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          formikHelpers.resetForm();
          refetch();
        } else if (payload?.listError) {
          formikHelpers.setErrors(payload.listError);
        } else {
          notif.error(message);
        }
      },
      onError: () => {
        notif.error('Please cek you connection');
      }
    });
  }

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Photo</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <AiOutlineLoading3Quarters className={'animate-spin'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div>
            {stockmovementvehicle ? (
              <>
                {stockmovementvehicle.stockmovementvehiclephotos?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    {stockmovementvehicle.stockmovementvehiclephotos
                      ?.slice() // buat salinan agar tidak mengubah array asli
                      .sort((a, b) => new Date(a.createDt).getTime() - new Date(b.createDt).getTime()) // ascending (terlama dulu)
                      .map((item, index) => {
                        return (
                          <div key={index} className="flex flex-col justify-between bg-gray-100 rounded">
                            <DisplayImage alt="" src={item.photoUrl} />
                            <div className="p-2">
                              <div className="font-bold mb-2">{item.warehouse?.name}</div>
                              <div className="capitalize">{item.createName}</div>
                              <div className="text-xs">{displayDateTime(item.createDt)}</div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <div className="py-10">
                      <div className="flex justify-center items-center mb-4">
                        <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                      </div>
                      <div className="text-xl">{'Data Tidak Ditemukan'}</div>
                    </div>
                  </div>
                )}
                {allowAdd && (
                  <>
                    <hr className="border-1 border-gray-200 my-4" />
                    <Formik
                      initialValues={initFormikValue}
                      validationSchema={schema}
                      enableReinitialize={true}
                      onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
                    >
                      {({ values }) => {
                        return (
                          <Form noValidate={true} encType='multipart/form-data' >
                            <div className="mb-4">
                              <ImageField
                                label={'Add Photo'}
                                name={`photo`}
                                placeholder={'Add Photo'}
                              />
                            </div>
                            <div className="mb-4">
                              <ButtonSubmit
                                label={'Simpan'}
                                disabled={isPending}
                                loading={isPending}
                              />
                            </div>
                          </Form>
                        )
                      }}
                    </Formik>
                  </>
                )}
              </>
            ) : (
              <div className="flex justify-center items-center">
                <div className="py-20">
                  <div className="flex justify-center items-center mb-4">
                    <PiFolderOpenDuotone size={'4rem'} className={'text-gray-500'} />
                  </div>
                  <div className="text-xl">{'Data Tidak Ditemukan'}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalPhoto;