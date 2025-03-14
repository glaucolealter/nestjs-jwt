import {
  Body,
  CacheTTL,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AtualizaUsuarioDTO } from './dto/AtualizaUsuario.dto';
import { CriaUsuarioDTO } from './dto/CriaUsuario.dto';
import { ListaUsuarioDTO } from './dto/ListaUsuario.dto';
import { UsuarioService } from './usuario.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('/usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  async criaUsuario(@Body() dadosDoUsuario: CriaUsuarioDTO) {
    const usuarioCriado = await this.usuarioService.criaUsuario(dadosDoUsuario);

    return {
      messagem: 'usuário criado com sucesso',
      usuario: new ListaUsuarioDTO(usuarioCriado.id, usuarioCriado.nome),
    };
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(15 * 60 * 1000)
  async listUsuarios() {
    const usuariosSalvos = await this.usuarioService.listUsuarios();

    console.log('Todos os usuários recuperados do banco de dados');

    return {
      mensagem: 'Usuários obtidos com sucesso.',
      usuarios: usuariosSalvos,
    };
  }

  @Put('/:id')
  async atualizaUsuario(
    @Param('id') id: string,
    @Body() novosDados: AtualizaUsuarioDTO,
  ) {
    const usuarioAtualizado = await this.usuarioService.atualizaUsuario(
      id,
      novosDados,
    );

    return {
      messagem: 'usuário atualizado com sucesso',
      usuario: usuarioAtualizado,
    };
  }

  @Delete('/:id')
  async removeUsuario(@Param('id') id: string) {
    const usuarioRemovido = await this.usuarioService.deletaUsuario(id);

    return {
      messagem: 'usuário removido com suceso',
      usuario: usuarioRemovido,
    };
  }
}
