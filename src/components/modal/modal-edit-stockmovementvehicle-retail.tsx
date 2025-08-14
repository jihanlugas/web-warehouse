import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdateStockmovementvehicleRetail } from "@/types/stockmovementvehicleretail";
import { useMutation, useQuery } from "@tanstack/react-query";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import notif from "@/utils/notif";
import TextFieldNumber from "../formik/text-field-number";
import { displayNumber } from "@/utils/formater";


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({

});

const defaultInitFormikValue: UpdateStockmovementvehicleRetail = {
  sentGrossQuantity: '',
  sentTareQuantity: '',
  sentNetQuantity: '',
}

const ModalEditStockmovementvehiclePurchasorder: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdateStockmovementvehicleRetail>(defaultInitFormikValue)

  const preloads = ''
  const { data, isLoading } = useQuery({
    queryKey: ['stockmovementvehicle', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/stockmovementvehicle/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['stockmovementvehicle', 'retail', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/stockmovementvehicle/retail/' + selectedId, val),
  });


  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          sentGrossQuantity: data.payload.sentGrossQuantity,
          sentTareQuantity: data.payload.sentTareQuantity,
          sentNetQuantity: data.payload.sentNetQuantity,
        })
      }
    }
  }, [data])

  useEffect(() => {
    if (show) {
      setSelectedId(id)
    } else {
      setSelectedId('')
    }
  }, [show, id])

  const handleSubmit = async (values: UpdateStockmovementvehicleRetail, formikHelpers: FormikHelpers<UpdateStockmovementvehicleRetail>) => {
    values.sentGrossQuantity = parseFloat(values.sentGrossQuantity as string) || 0
    values.sentTareQuantity = parseFloat(values.sentTareQuantity as string) || 0
    values.sentNetQuantity = values.sentGrossQuantity - values.sentTareQuantity
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

  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay('', true)} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Edit Delivery</div>
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
            <div className="ml-auto">
              <Formik
                initialValues={initFormikValue}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
              >
                {({ values }) => {
                  return (
                    <Form noValidate={true}>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Tare Quantity'}
                          name={`sentTareQuantity`}
                          placeholder={'Tare Quantity'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Gross Quantity'}
                          name={`sentGrossQuantity`}
                          placeholder={'Gross Quantity'}
                        />
                      </div>
                      <div className="mb-4">
                        <div>Net Quantity</div>
                      <div>{displayNumber((parseFloat(values.sentGrossQuantity as string || "0") - parseFloat(values.sentTareQuantity as string || "0")))}</div>
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isPending}
                          loading={isPending}
                        />
                      </div>
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ModalEditStockmovementvehiclePurchasorder;