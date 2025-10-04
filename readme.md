You are given an existing MERN stack project cloned from another event.
Now adapt this project for a school alumni meet called "Back to Hills 4.0".

Tasks:

Update all relevant fields in forms, MongoDB models, APIs, and frontend components according to the new event requirements.

Remove unused fields from the old event and ensure validations match the new requirements.

Adjust MongoDB models and backend routes to support the new schema.

Update frontend labels, dropdowns, and instructions.

Ensure the payment logic reflects the new rules.

New Requirements

Personal Information

Full Name (string, required)

Email (string, required, unique)

Mobile (string, required)

Gender (enum: Male, Female, Other, required)

Batch (enum: Batch 1 – Batch 32, required)

Rule: Batches 28–32 → No registration fee for the primary registrant. If they bring an extra person, Rs 200 per additional person.

Food Choice

Veg / Non-Veg (required)

Expected Time of Arrival

Options: 8-11, 11-14, 14-17, 17-20

Overnight Accommodation

Yes / No

Number of Attendees

Adults (18+) → Rs 300 for the primary registrant. Additional adults = Rs 200 each.

Children (6–17) → Rs 150 each.

Infants (0–5) → Free.

Guest Information

For every added guest (Adult / Child), collect:

Name (string)

Gender (enum)

Food Choice (Veg/Non-Veg)

Payment Details

Bank Details & UPI QR (static info to show)

Payment Transaction ID / Reference Number (string, required)

Form Behavior

Auto-calculate the total payable amount based on Batch, Attendees, and Guest Rules.

Show a breakdown of charges before submission.

Submit Form

Store registration in MongoDB with all details.

Save payment info along with reference number.

Provide confirmation to the user.

Deliverables

Updated MongoDB schema/model with new fields and rules.

Updated frontend form with validation and dynamic fee calculation.

Updated backend routes to handle new schema and store data.

Ensure proper payment summary logic before submission.

Rename the project and references to "Back to Hills 4.0".