import { NextPage } from "next/types";
import Modal from "./modal";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { IoClose } from "react-icons/io5";
import { ImSpinner2 } from 'react-icons/im';
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import { StockView, UpdateStock } from "@/types/stock";
import notif from "@/utils/notif";
import ButtonSubmit from "../formik/button-submit";
import TextFieldNumber from "../formik/text-field-number";
import { displayTon } from "@/utils/formater";
import { PiFolderOpenDuotone } from "react-icons/pi";




type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({

});

const defaultInitFormikValue: UpdateStock = {
  quantity: '',
}


const ModalAdjustmentStock: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')
  const [stock, setStock] = useState<StockView>(null)

  const [initFormikValue, setInitFormikValue] = useState<UpdateStock>(defaultInitFormikValue)

  const preloads = 'Product'
  const { data, isLoading } = useQuery({
    queryKey: ['stock', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/stock/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['stock', selectedId, 'update'],
    mutationFn: (val: FormikValues) => Api.put('/stock/' + selectedId, val),
  });

  const handleSubmit = async (values: UpdateStock, formikHelpers: FormikHelpers<UpdateStock>) => {
    values.quantity = parseFloat(values.quantity as string) || 0
    mutateSubmit(values, {
      onSuccess: ({ status, message, payload }) => {
        if (status) {
          notif.success(message);
          onClickOverlay('', true)
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

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  useEffect(() => {
    if (data) {
      if (data?.status) {
        setStock(data.payload)
        setInitFormikValue({
          quantity: data.payload.quantity,
        })
      }
    }
  }, [data])

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Adjustment Stock</div>
          <button type="button" onClick={() => onClickOverlay('', true)} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="py-20">
              <ImSpinner2 className={'animate-spin'} size={'5rem'} />
            </div>
          </div>
        ) : (
          <div>
            {stock ? (
              <>
                <div className="text-lg text-gray-600 flex">
                  <div className="mr-4">{stock.product?.name || stock.id}</div>
                  <div className="font-bold mr-4">{displayTon(stock.quantity)}</div>
                </div>
                <div className="ml-auto">
                  <Formik
                    initialValues={initFormikValue}
                    validationSchema={schema}
                    enableReinitialize={true}
                    onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
                  >
                    {({ values, errors }) => {
                      return (
                        <Form noValidate={true}>
                          <div className="mb-4">
                            <TextFieldNumber
                              label={'Berat'}
                              name={`quantity`}
                              placeholder={'1...'}
                            />
                          </div>
                          <div className="mb-4">
                            <ButtonSubmit
                              label={'Simpan'}
                              disabled={isPending}
                              loading={isPending}
                            />
                          </div>
                          {process.env.DEBUG === 'true' && (
                            <>
                              <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                                {JSON.stringify(values, null, 4)}
                              </div>
                              <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                                {JSON.stringify(errors, null, 4)}
                              </div>
                            </>
                          )}
                        </Form>
                      )
                    }}
                  </Formik>
                </div>
              </>
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
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalAdjustmentStock;