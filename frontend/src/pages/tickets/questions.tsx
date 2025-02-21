/** @jsxRuntime classic */

/** @jsx jsx */
import { jsx } from "theme-ui";

import { useRouter } from "next/router";

import { QuestionsSection } from "~/components/tickets-page/questions-section";
import { useCart } from "~/components/tickets-page/use-cart";
import { TicketsPageWrapper } from "~/components/tickets-page/wrapper";

export const TicketsQuestionsPage = () => {
  const router = useRouter();

  const { state, updateTicketInfo, updateQuestionAnswer } = useCart();

  return (
    <TicketsPageWrapper>
      {({ tickets }) => (
        <QuestionsSection
          tickets={tickets}
          updateTicketInfo={updateTicketInfo}
          updateQuestionAnswer={updateQuestionAnswer}
          selectedProducts={state.selectedProducts}
          onNextStep={() => {
            router.push("/tickets/review/");
          }}
        />
      )}
    </TicketsPageWrapper>
  );
};

export default TicketsQuestionsPage;
