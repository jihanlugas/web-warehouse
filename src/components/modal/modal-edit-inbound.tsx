import Modal from "@/components/modal/modal";
import { Api } from "@/lib/api";
import { UpdateInbound } from "@/types/inbound";
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


type Props = {
  show: boolean;
  onClickOverlay: (id?: string, refresh?: boolean) => void;
  id: string
}

const schema = Yup.object().shape({

});

const defaultInitFormikValue: UpdateInbound = {
  recivedGrossQuantity: '',
  recivedTareQuantity: '',
  recivedNetQuantity: '',
}

const ModalEditInbound: NextPage<Props> = ({ show, onClickOverlay, id }) => {

  const [selectedId, setSelectedId] = useState<string>('')

  const [initFormikValue, setInitFormikValue] = useState<UpdateInbound>(defaultInitFormikValue)

  const preloads = ''
  const { data, isLoading } = useQuery({
    queryKey: ['inbound', selectedId, preloads],
    queryFn: ({ queryKey }) => {
      const [, selectedId] = queryKey;
      return selectedId ? Api.get('/inbound/' + selectedId, { preloads }) : null
    },
  })

  const { mutate: mutateSubmit, isPending } = useMutation({
    mutationKey: ['inbound', 'update', selectedId],
    mutationFn: (val: FormikValues) => Api.put('/inbound/' + selectedId, val),
  });


  useEffect(() => {
    if (data) {
      if (data?.status) {
        setInitFormikValue({
          recivedGrossQuantity: data.payload.recivedGrossQuantity,
          recivedTareQuantity: data.payload.recivedTareQuantity,
          recivedNetQuantity: data.payload.recivedNetQuantity,
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

  const handleSubmit = async (values: UpdateInbound, formikHelpers: FormikHelpers<UpdateInbound>) => {
    values.recivedGrossQuantity = parseFloat(values.recivedGrossQuantity as string) || 0
    values.recivedTareQuantity = parseFloat(values.recivedTareQuantity as string) || 0
    values.recivedNetQuantity = values.recivedGrossQuantity - values.recivedTareQuantity
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
          <div>Edit Inbound</div>
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
                          name={`recivedTareQuantity`}
                          placeholder={'Tare Quantity'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextFieldNumber
                          label={'Gross Quantity'}
                          name={`recivedGrossQuantity`}
                          placeholder={'Gross Quantity'}
                        />
                      </div>
                      <div className="mb-4">
                        <div>Net Quantity</div>
                      <div>{(parseFloat(values.recivedGrossQuantity as string || "0") - parseFloat(values.recivedTareQuantity as string || "0"))}</div>
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

export default ModalEditInbound;