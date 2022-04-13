// Entity
import { CardProps } from "../../../domain/entities/card";

// Types and Interfaces
import { CardRepository } from "../../repositories/IcardRepository";

// Supabase client
import { supabase } from "../../../utils/connect_db";

import { generateRandomCardsNumber } from "../../../utils/randomNumberGenerator";
import { generatePDF } from "../../../utils/PDF/generatePDF";

export class CardController implements CardRepository {
  // Save functionality
  async generate(card: CardProps): Promise<any> {
    const randomCardsNumber = generateRandomCardsNumber(card);

    card.values_sorted = randomCardsNumber;

    const html = await generatePDF(card);

    card.html = html;

    // Generate card here
    const result = await supabase.from("cards").insert([card]);

    return result;
  }

  // Read functionality
  async read(user_uuid: string): Promise<any> {
    // read card here
    const result = await supabase
      .from("cards")
      .select("*")
      .eq("client_id", user_uuid);

    return result;
  }

  // Update Status Card
  async update(
    card_id: string,
    new_status: string,
    value_sorted?: number
  ): Promise<any> {
    if (value_sorted !== undefined) {
      const result = await supabase
        .from("cards")
        .update({ status: new_status, sort_result: value_sorted })
        .match({ card_id: card_id });

      return result;
    }

    const result = await supabase
      .from("cards")
      .update({ status: new_status })
      .match({ card_id: card_id });

    return result;
  }

  // delete functionality
  async delete(card_id: string): Promise<any> {
    // delete card here
    const result = await supabase
      .from("cards")
      .delete()
      .match({ card_id: card_id });

    return result;
  }
}
