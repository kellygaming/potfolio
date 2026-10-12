import test from "node:test";
import assert from "node:assert/strict";
import { validateContact, escapeHtml } from "../lib/contact.ts";
const valid = { nom: "Kelly", email: "test@example.com", projet: "Site vitrine", message: "Un site pour présenter mon activité.", budget: "À définir", whatsapp: "+225 01 00 00 00 00" };
test("accepte une demande internationale et conserve les caractères français", () => {
  const result = validateContact({ ...valid, nom: "  Françoise  ", budget: "500 EUR", whatsapp: "+33 6 00 00 00 00" });
  assert.equal(result.kind, "valid");
  if (result.kind === "valid") { assert.equal(result.data.nom, "Françoise"); assert.equal(result.data.budget, "500 EUR"); }
});
test("refuse les corps JSON inattendus sans lever d’exception", () => {
  for (const body of [null, [], true, 8, "texte", { ...valid, message: {} }, { ...valid, email: ["x"] }]) assert.equal(validateContact(body).kind, "invalid");
});
test("refuse un e-mail invalide, un message trop court et un champ trop long", () => {
  for (const body of [{ ...valid, email: "adresse" }, { ...valid, message: "court" }, { ...valid, message: "x".repeat(4001) }, { ...valid, nom: "" }]) assert.equal(validateContact(body).kind, "invalid");
});
test("bloque les en-têtes injectés et les types de projet hors liste", () => {
  assert.equal(validateContact({ ...valid, nom: "Kelly\r\nBcc: autre@example.com" }).kind, "invalid");
  assert.equal(validateContact({ ...valid, projet: "Valeur inventée" }).kind, "invalid");
});
test("le pot de miel ne produit pas une demande à envoyer", () => { assert.equal(validateContact({ website: "spam.example" }).kind, "spam"); });
test("le HTML fourni par un visiteur reste du texte dans l’e-mail", () => { assert.equal(escapeHtml('<script>"x" & \'y\'</script>'), "&lt;script&gt;&quot;x&quot; & &#39;y&#39;&lt;/script&gt;"); });
