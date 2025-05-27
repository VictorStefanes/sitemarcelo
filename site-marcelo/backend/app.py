import customtkinter as ctk
from PIL import Image, ImageTk  # Use Pillow para imagens
from tkinter import END  # Corrige o uso de END nas funções limpa_Entry
from tkinter import messagebox  # Importa messagebox para exibir mensagens
import os

import sqlite3
import re  # Importado aqui para uso na validação de email

# Classe responsável pela comunicação com o banco de dados e funções de backend
class BackEnd:
    # Conecta ao banco de dados SQLite (cria o arquivo se não existir)
    def conecta_db(self):
        # Conectando ao banco de dados SQLite
        self.conn = sqlite3.connect("usuarios.db")
        self.cursor = self.conn.cursor()
        print("Banco de dados conectado com sucesso!")
    
    # Desconecta do banco de dados
    def desconecta_db(self):
        # Desconectando do banco de dados
        self.conn.close()
        print("Banco de dados desconectado com sucesso!")
        
    # Cria a tabela de usuários caso não exista
    def cria_tabela(self):
        # Conectando ao banco para criar a tabela
        self.conecta_db()
        # Atualizando a tabela para não ter mais CONFIRMA_SENHA e garantir unicidade do email
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios( 
                ID INTEGER PRIMARY KEY AUTOINCREMENT,
                USERNAME TEXT NOT NULL,
                EMAIL TEXT NOT NULL UNIQUE,
                SENHA TEXT NOT NULL
            );
        """)
        self.conn.commit()
        print("Tabela de usuários criada/atualizada com sucesso!")
        # Desconectando após criar a tabela
        self.desconecta_db()
        
    # Função para cadastrar um novo usuário no banco
    def cadastrar_usuario(self):
        self.username_cadastro = self.username_cadastro_entry.get()
        self.email_cadastro = self.email_cadastro_entry.get()
        self.senha_cadastro = self.senha_cadastro_entry.get()
        self.confirma_senha_cadastro = self.confirma_senha_entry.get()

        # Validação: nome de usuário não pode conter espaço
        if " " in self.username_cadastro:
            messagebox.showerror(title="Cadastro Inválido", message="O nome de usuário não pode conter espaços.")
            return

        # Validação: email obrigatório, deve conter @ e ser válido
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if (self.email_cadastro == "" or "@" not in self.email_cadastro or not re.match(email_regex, self.email_cadastro)):
            messagebox.showerror(title="Cadastro Inválido", message="Digite um e-mail válido.")
            return

        # Validação: todos os campos obrigatórios
        if (self.username_cadastro == "" or self.email_cadastro == "" or self.senha_cadastro == "" or self.confirma_senha_cadastro == ""):
            messagebox.showerror(title = "sistema de login", message="Por favor, preencha todos os campos!")
            return

        # Validação: senha e confirma senha devem ser iguais
        if self.senha_cadastro != self.confirma_senha_cadastro:
            messagebox.showerror(title="Cadastro Inválido", message="As senhas não coincidem.")
            return

        self.conecta_db()
        # Verifica se o e-mail já existe
        self.cursor.execute("SELECT * FROM usuarios WHERE EMAIL = ?", (self.email_cadastro,))
        email_existe = self.cursor.fetchone() is not None
        # Verifica se o usuário já existe
        self.cursor.execute("SELECT * FROM usuarios WHERE USERNAME = ?", (self.username_cadastro,))
        usuario_existe = self.cursor.fetchone() is not None
        self.desconecta_db()

        if email_existe and usuario_existe:
            messagebox.showerror(title="Cadastro Inválido", message="Este e-mail e nome de usuário já estão cadastrados.")
            return
        elif email_existe:
            messagebox.showerror(title="Cadastro Inválido", message="Este e-mail já está cadastrado.")
            return
        elif usuario_existe:
            messagebox.showerror(title="Cadastro Inválido", message="Este nome de usuário já está cadastrado.")
            return

        # Armazenando senha de forma segura (hash)
        import hashlib
        senha_hash = hashlib.sha256(self.senha_cadastro.encode()).hexdigest()

        self.conecta_db()
        self.cursor.execute("""
                INSERT INTO usuarios (USERNAME, EMAIL, SENHA)
                VALUES (?, ?, ?)""", (self.username_cadastro, self.email_cadastro, senha_hash))
        self.conn.commit()
        self.desconecta_db()
        messagebox.showinfo(title="Cadastro realizado", message="Usuário cadastrado com sucesso!")
        self.limpa_Entry_cadastro()
        self.voltar_login()

    def login_usuario(self):
        username = self.username_login_entry.get()
        senha = self.senha_login_entry.get()

        if username == "" or senha == "":
            messagebox.showerror(title="Login Inválido", message="Preencha todos os campos!")
            return

        self.conecta_db()
        # Busca usuário pelo nome
        self.cursor.execute("SELECT SENHA FROM usuarios WHERE USERNAME = ?", (username,))
        resultado = self.cursor.fetchone()
        self.desconecta_db()

        if resultado:
            import hashlib
            senha_hash = hashlib.sha256(senha.encode()).hexdigest()
            if senha_hash == resultado[0]:
                messagebox.showinfo(title="Login", message="Login realizado com sucesso!")
                self.limpa_Entry_login()
                # Aqui você pode redirecionar para a próxima tela do sistema
            else:
                messagebox.showerror(title="Login Inválido", message="Senha incorreta.")
        else:
            messagebox.showerror(title="Login Inválido", message="Usuário não encontrado.")


# Classe principal da aplicação, responsável pela interface gráfica e integração com o backend
class App(ctk.CTk, BackEnd):  # Renomeado para seguir a convenção PascalCase
    def __init__(self) -> None:
        super().__init__()
        # Cria a tabela de usuários ao iniciar o app (garante que existe)
        self.cria_tabela()  
        # Configura a janela principal
        self.configuracao_da_janela_inicial()
        # Exibe a tela de login ao iniciar
        self.tela_de_login()

    # Configurando a janela principal
    def configuracao_da_janela_inicial(self):
        self.geometry("800x450")
        self.title("Sistema de login")
        self.resizable(False, False)

    # Criando a tela de login
    def tela_de_login(self):
        # Caminho absoluto para a imagem
        img_path = os.path.join(os.path.dirname(__file__), "imgcerta.png")
        img_pil = Image.open(img_path)
        img_pil = img_pil.resize((400, 400))
        self.img = ctk.CTkImage(light_image=img_pil, size=(400, 400))
        self.lb_img = ctk.CTkLabel(self, text=None, image=self.img)
        self.lb_img.image = self.img  
        self.lb_img.grid(row=1, column=0, padx=10, pady=10, sticky="nw")

        # Configurando o título
        self.title = ctk.CTkLabel(
            self, text="Faça o seu login ou cadastre-se\npara ter acesso á sua conta", 
            font=("Century Gothic bold", 14)
        )
        self.title.grid(row=0, column=0, pady=(40,10))  
        
        # Configurando formulário de login
        self.frame_login = ctk.CTkFrame(
            self,
            width=350, height=380
        )
        self.frame_login.place(x=450, y=30) 

        # configurando widgets dentro do frame - formulário
        self.lb_title = ctk.CTkLabel(
            self.frame_login, 
            text="Faça o seu Login", 
            font=("Century Gothic bold", 22))
        self.lb_title.grid(row=0, column=0, pady=(40,10))

        self.username_login_entry = ctk.CTkEntry(
            self.frame_login,
            placeholder_text="Usuário",
            width=300,
            font=("Century Gothic bold", 16),
            corner_radius=15,
        )
        self.username_login_entry.grid(row=1, column=0, pady=10, padx=10)

        self.senha_login_entry = ctk.CTkEntry(
            self.frame_login,
            placeholder_text="Senha",
            width=300,
            font=("Century Gothic bold", 16),
            corner_radius=15,
            show="*"
        )
        self.senha_login_entry.grid(row=2, column=0, pady=10, padx=10)

        self.ver_senha = ctk.CTkCheckBox(
            self.frame_login,
            text="Mostrar Senha",
            font=("Century Gothic bold", 16),
            command=self.toggle_senha,
            corner_radius=20
        )
        self.ver_senha.grid(row=3, column=0, pady=10, padx=10)

        self.btn_login = ctk.CTkButton(
            self.frame_login,
            width=300,
            text="Fazer Login".upper(),
            font=("Century Gothic bold", 16),
            corner_radius=15,
            command=self.login_usuario
        )
        self.btn_login.grid(row=4, column=0, pady=10, padx=10)
        
        self.span = ctk.CTkLabel(
            self.frame_login,
            text= "Se nao tem uma conta, clique no botão abaixo\npara cadastrar-se",
            font=("Century Gothic bold", 12),
        )
        self.span.grid(row=5, column=0, pady=10, padx=10)
        
        self.btn_cadastro = ctk.CTkButton(
            self.frame_login,
            width=300,
            text="Fazer Cadastro".upper(),
            font=("Century Gothic bold", 16),
            corner_radius=15,
            fg_color="green",
            hover_color="#050",
            command=self.tela_de_cadastro
        )
        self.btn_cadastro.grid(row=6, column=0, pady=10, padx=10)

    def toggle_senha(self):
        if self.ver_senha.get():
            self.senha_login_entry.configure(show="")
        else:
            self.senha_login_entry.configure(show="*")
            
            
    def tela_de_cadastro(self):
        # remover a tela de login
        self.frame_login.place_forget()
        
        # frame de formulário de cadastro
        self.frame_cadastro = ctk.CTkFrame(
            self,
            width=350, height=380
        )
        self.frame_cadastro.place(x=450, y=30) 
        
        #Criando o nosso frame de cadastro
        self.lb_title = ctk.CTkLabel(
            self.frame_cadastro, 
            text="Faça o seu Cadastro", 
            font=("Century Gothic bold", 22))
        self.lb_title.grid(row=0, column=0, pady=(40,10))
        
        #criar os widgets da tela de cadastro
        self.username_cadastro_entry = ctk.CTkEntry(
            self.frame_cadastro,
            placeholder_text="Insira o seu nome de Usuário",
            width=300,
            font=("Century Gothic bold", 16),
            corner_radius=15
        )
        self.username_cadastro_entry.grid(row=1, column=0, pady=5, padx=10)

        self.email_cadastro_entry = ctk.CTkEntry(
            self.frame_cadastro,
            placeholder_text="Insira o seu Email",
            width=300,
            font=("Century Gothic bold", 16),
            corner_radius=15
        )
        self.email_cadastro_entry.grid(row=2, column=0, pady=5, padx=10)

        self.senha_cadastro_entry = ctk.CTkEntry(
            self.frame_cadastro,
            placeholder_text="Digite a sua senha",
            width=300,
            font=("Century Gothic bold", 16),
            corner_radius=15,
            show="*"
        )
        self.senha_cadastro_entry.grid(row=3, column=0, pady=5, padx=10)

        self.confirma_senha_entry = ctk.CTkEntry(
            self.frame_cadastro,
            placeholder_text="Confirme a Senha",
            width=300,
            font=("Century Gothic bold", 16),
            corner_radius=15,
            show="*",
        )
        self.confirma_senha_entry.grid(row=4, column=0, pady=5, padx=10)

        # Adicionando o checkbox "Mostrar Senha" para cadastro
        self.ver_senha_cadastro = ctk.CTkCheckBox( 
            self.frame_cadastro,
            text="Mostrar Senha",
            font=("Century Gothic bold", 16),
            command=self.toggle_senha_cadastro,
            corner_radius=20
        )
        self.ver_senha_cadastro.grid(row=5, column=0, pady=5)
        
        # Botão para efetuar cadastro
        self.btn_cadastrar_user = ctk.CTkButton(
            self.frame_cadastro,
            width=300,
            text="Fazer Cadastro".upper(),
            font=("Century Gothic bold", 16),
            corner_radius=15,
            fg_color="green",
            hover_color="#050",
            command=self.cadastrar_usuario
        )
        self.btn_cadastrar_user.grid(row=6, column=0, pady=10, padx=10)

        # Botão para voltar ao login
        self.btn_login_back = ctk.CTkButton(
            self.frame_cadastro,
            width=300,
            text="Voltar ao Login".upper(),
            font=("Century Gothic bold", 16),
            corner_radius=15,
            command=self.voltar_login
        )
        self.btn_login_back.grid(row=7, column=0, pady=10, padx=10)
        
        
    def limpa_Entry_cadastro(self):
        self.username_cadastro_entry.delete(0, END)
        self.email_cadastro_entry.delete(0, END)
        self.senha_cadastro_entry.delete(0, END)
        self.confirma_senha_entry.delete(0, END)
    def limpa_Entry_login(self):
        self.username_login_entry.delete(0, END)
        self.senha_login_entry.delete(0, END)    
        


    def toggle_senha_cadastro(self):
        if self.ver_senha_cadastro.get():
            self.senha_cadastro_entry.configure(show="")
            self.confirma_senha_entry.configure(show="")
        else:
            self.senha_cadastro_entry.configure(show="*")
            self.confirma_senha_entry.configure(show="*")

    def voltar_login(self):
        self.frame_cadastro.place_forget()
        self.tela_de_login()

if __name__ == "__main__":
    app = App()  # Atualizado para refletir a mudança no nome da classe
    app.mainloop()
