const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = new mongoose.model("Contato", ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
  }

  async edit(id) {
    if (typeof id !== "string") return;

    this.valida();

    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }

  static async buscaPorId(id) {
    if (typeof id !== "string") return;
    const user = await ContatoModel.findById(id);

    return user;
  }

  async register() {
    this.valida();

    if (this.errors.length > 0) return;

    this.contato = await ContatoModel.create(this.body);
  }

  valida() {
    this.cleanUp();

    if (this.body.email && !validator.isEmail(this.body.email))
      this.errors.push("E-mail inválido.");
    if (!this.body.nome) this.errors.push("Nome é um campo obrigatório");
    if (!this.body.email && !this.body.telefone) {
      this.errors.push(
        "Pelo menos um contato deve ser enviado: e-mail ou telefone."
      );
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    // Garantindo que o objeto vai conter apenas o campo email e senha
    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    };
  }
}

module.exports = Contato;
