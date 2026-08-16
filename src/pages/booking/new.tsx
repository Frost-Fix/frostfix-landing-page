import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import {
    Box,
    Button,
    Center,
    HStack,
    Spinner,
    VStack,
    Text,
    Heading,
} from "@chakra-ui/react";
import { useRequireRole } from "@/lib/useRequireRole";
import { apiPost, ApiError } from "@/lib/api";
import { Address, PaymentMethod, Service, TimeSlot } from "@/types/booking";
import { useToast } from "@chakra-ui/react";

import StepIndicator from "@/components/booking/StepIndicator";
import ServiceStep from "@/components/booking/ServiceStep";
import AddressStep from "@/components/booking/AddressStep";
import DateSlotStep from "@/components/booking/DateSlotStep";
import PaymentStep from "@/components/booking/PaymentStep";
import ReviewStep from "@/components/booking/ReviewStep";

const STEP_LABELS = ["Service", "Address", "Date", "Payment", "Review"];

const EMPTY_ADDRESS: Address = {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Canada",
};

const NewBooking: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    const { session, isReady } = useRequireRole("homeowner");

    const [step, setStep] = useState(0);
    const [service, setService] = useState<Service | null>(null);
    const [address, setAddress] = useState<Address>(EMPTY_ADDRESS);
    const [contactPhone, setContactPhone] = useState("");
    const [scheduledDate, setScheduledDate] = useState<string | null>(null);
    const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
    const [slotLabel, setSlotLabel] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
        null
    );
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(
        null
    );

    if (!isReady) {
        return (
            <Center minH="100dvh">
                <Spinner size="lg" color="var(--season-primary)" />
            </Center>
        );
    }

    const canGoNext = () => {
        switch (step) {
            case 0:
                return !!service;
            case 1:
                return (
                    !!address.street &&
                    !!address.city &&
                    !!address.state &&
                    !!address.postalCode &&
                    !!contactPhone
                );
            case 2:
                return !!scheduledDate && !!timeSlot;
            case 3:
                return !!paymentMethod;
            default:
                return true;
        }
    };

    const handleSubmit = async () => {
        if (!service || !scheduledDate || !timeSlot || !paymentMethod) return;

        setIsSubmitting(true);

        try {
            const res = await apiPost<{ data: { _id: string } }>(
                "/api/homeowners/profiles/mine/bookings",
                {
                    serviceId: service._id,
                    address,
                    contactPhone,
                    scheduledDate,
                    timeSlot,
                    paymentMethod,
                    notes,
                },
                { token: session!.token }
            );
            setConfirmedBookingId(res.data._id);
        } catch (err) {
            const message =
                err instanceof ApiError ? err.message : "Something went wrong.";
            toast({ title: message, status: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (confirmedBookingId) {
        return (
            <>
                <Head>
                    <title>Booking Confirmed</title>
                </Head>
                <Center minH="100dvh" px={4}>
                    <VStack
                        spacing={4}
                        maxW="420px"
                        textAlign="center"
                        bg="white"
                        p={8}
                        borderRadius="1.25rem"
                        boxShadow="0 10px 40px rgba(11, 37, 69, 0.08)"
                    >
                        <Text fontSize="5xl">✅</Text>
                        <Heading fontSize="xl" color="var(--season-primary)">
                            You&apos;re all booked!
                        </Heading>
                        <Text color="gray.500">
                            We&apos;ll email you as soon as a contractor is
                            assigned to your job.
                        </Text>
                        <VStack w="100%" spacing={3} pt={2}>
                            <Button
                                w="100%"
                                bg="var(--season-primary)"
                                color="white"
                                onClick={() =>
                                    router.push(`/bookings/${confirmedBookingId}`)
                                }
                            >
                                View booking
                            </Button>
                            <Button
                                w="100%"
                                variant="outline"
                                onClick={() => router.push("/bookings")}
                            >
                                Go to my bookings
                            </Button>
                        </VStack>
                    </VStack>
                </Center>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Book a Service</title>
            </Head>
            <Box
                minH="100dvh"
                bgGradient="linear(to-b, var(--season-bg-from), var(--season-bg-to))"
            >
                <Box maxW="720px" mx="auto" px={[4, 6]} py={[6, 10]}>
                    <StepIndicator steps={STEP_LABELS} currentStep={step} />

                    <Box
                        bg="white"
                        borderRadius="1.25rem"
                        boxShadow="0 10px 40px rgba(11, 37, 69, 0.06)"
                        p={[5, 8]}
                        mt={8}
                    >
                        {step === 0 && (
                            <ServiceStep
                                selectedServiceId={service?._id || null}
                                onSelect={setService}
                            />
                        )}
                        {step === 1 && (
                            <AddressStep
                                address={address}
                                contactPhone={contactPhone}
                                onChangeAddress={setAddress}
                                onChangePhone={setContactPhone}
                            />
                        )}
                        {step === 2 && (
                            <DateSlotStep
                                homeownerToken={session!.token}
                                scheduledDate={scheduledDate}
                                timeSlot={timeSlot}
                                onSelectDate={(date) => {
                                    setScheduledDate(date);
                                    setTimeSlot(null);
                                    setSlotLabel("");
                                }}
                                onSelectSlot={(slot, label) => {
                                    setTimeSlot(slot);
                                    setSlotLabel(label);
                                }}
                            />
                        )}
                        {step === 3 && (
                            <PaymentStep
                                paymentMethod={paymentMethod}
                                notes={notes}
                                onSelectPaymentMethod={setPaymentMethod}
                                onChangeNotes={setNotes}
                            />
                        )}
                        {step === 4 &&
                            service &&
                            scheduledDate &&
                            timeSlot &&
                            paymentMethod && (
                                <ReviewStep
                                    service={service}
                                    address={address}
                                    contactPhone={contactPhone}
                                    scheduledDate={scheduledDate}
                                    slotLabel={slotLabel}
                                    paymentMethod={paymentMethod}
                                    notes={notes}
                                />
                            )}

                        <HStack justify="space-between" pt={8}>
                            <Button
                                variant="ghost"
                                onClick={() => setStep((s) => Math.max(0, s - 1))}
                                isDisabled={step === 0}
                            >
                                Back
                            </Button>
                            {step < STEP_LABELS.length - 1 ? (
                                <Button
                                    bg="var(--season-primary)"
                                    color="white"
                                    _hover={{ opacity: 0.9 }}
                                    isDisabled={!canGoNext()}
                                    onClick={() => setStep((s) => s + 1)}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    bg="var(--season-primary)"
                                    color="white"
                                    _hover={{ opacity: 0.9 }}
                                    isLoading={isSubmitting}
                                    onClick={handleSubmit}
                                >
                                    Confirm booking
                                </Button>
                            )}
                        </HStack>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default NewBooking;
