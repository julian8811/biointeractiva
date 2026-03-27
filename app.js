const state = {
  completed: {
    cli: false,
    db: false,
    genomics: false,
    phylo: false
  },
  score: 0
};

const STORAGE_KEY = "biointeractiva_progress_v1";

const cliCommandCatalog = [
  {
    cmd: "pwd",
    category: "Navegacion",
    syntax: "pwd",
    detail:
      "Muestra la ruta absoluta del directorio actual. Es clave para evitar ejecutar comandos en la carpeta equivocada.",
    bioExample: "pwd  # Verifica que estas en el proyecto de analisis"
  },
  {
    cmd: "ls",
    category: "Navegacion",
    syntax: "ls -lah",
    detail:
      "Lista archivos y carpetas. Con -l muestra permisos y tamano; con -a incluye ocultos; con -h hace legible el tamano.",
    bioExample: "ls -lah datos_fastq/"
  },
  {
    cmd: "cd",
    category: "Navegacion",
    syntax: "cd ruta/directorio",
    detail:
      "Cambia de directorio. Usa rutas relativas o absolutas para moverte rapido entre carpetas de resultados.",
    bioExample: "cd analisis/01_qc"
  },
  {
    cmd: "mkdir",
    category: "Archivos",
    syntax: "mkdir -p resultados/{qc,alineamiento,variantes}",
    detail:
      "Crea carpetas. Con -p crea jerarquias completas; util para estandarizar pipelines reproducibles.",
    bioExample: "mkdir -p proyecto/{raw,clean,results,logs}"
  },
  {
    cmd: "cp",
    category: "Archivos",
    syntax: "cp origen destino",
    detail:
      "Copia archivos o carpetas. Con -r copia recursivamente directorios completos.",
    bioExample: "cp -r referencia/hg38.fa respaldo/"
  },
  {
    cmd: "mv",
    category: "Archivos",
    syntax: "mv archivo nuevo_nombre",
    detail:
      "Mueve o renombra archivos. Muy usado para normalizar nombres de muestras.",
    bioExample: "mv muestra1.fastq.gz paciente_001_R1.fastq.gz"
  },
  {
    cmd: "rm",
    category: "Archivos",
    syntax: "rm archivo; rm -r carpeta",
    detail:
      "Elimina archivos o carpetas. Es destructivo; recomienda revisar antes con ls.",
    bioExample: "rm lecturas_tmp.fastq"
  },
  {
    cmd: "cat",
    category: "Inspeccion",
    syntax: "cat archivo",
    detail:
      "Imprime contenido completo de un archivo en terminal. Mejor para archivos cortos.",
    bioExample: "cat metadata.tsv"
  },
  {
    cmd: "head",
    category: "Inspeccion",
    syntax: "head -n 20 archivo",
    detail:
      "Muestra primeras lineas. Util para inspeccionar rapidamente FASTA, FASTQ o tablas.",
    bioExample: "head -n 8 muestra_R1.fastq"
  },
  {
    cmd: "tail",
    category: "Inspeccion",
    syntax: "tail -n 20 archivo",
    detail:
      "Muestra ultimas lineas. Ideal para revisar logs al final de una ejecucion.",
    bioExample: "tail -n 30 logs/alineamiento.log"
  },
  {
    cmd: "less",
    category: "Inspeccion",
    syntax: "less archivo",
    detail:
      "Permite navegar archivo pagina por pagina sin cargarlo completo en pantalla.",
    bioExample: "less anotacion.gff3"
  },
  {
    cmd: "wc",
    category: "Conteo",
    syntax: "wc -l archivo",
    detail:
      "Cuenta lineas, palabras y bytes. Con -l se usa para conteos rapidos de registros.",
    bioExample: "wc -l genes_diferenciales.tsv"
  },
  {
    cmd: "grep",
    category: "Busqueda",
    syntax: "grep 'patron' archivo",
    detail:
      "Busca patrones por expresiones regulares. Fundamental para filtrar por IDs o motivos.",
    bioExample: "grep '^>' secuencias.fasta | wc -l"
  },
  {
    cmd: "cut",
    category: "Tabulares",
    syntax: "cut -f1,3 archivo.tsv",
    detail:
      "Extrae columnas por delimitador. Muy util en archivos TSV/CSV bioinformaticos.",
    bioExample: "cut -f1,5 variantes.vcf"
  },
  {
    cmd: "sort",
    category: "Tabulares",
    syntax: "sort -k2,2n archivo.tsv",
    detail:
      "Ordena lineas. Con claves numericas permite ordenar por cobertura, score o p-value.",
    bioExample: "sort -k6,6gr blast_hits.tsv"
  },
  {
    cmd: "uniq",
    category: "Tabulares",
    syntax: "sort archivo | uniq -c",
    detail:
      "Elimina duplicados consecutivos. Con -c cuenta ocurrencias de cada valor.",
    bioExample: "cut -f1 taxonomia.tsv | sort | uniq -c"
  },
  {
    cmd: "awk",
    category: "Procesamiento",
    syntax: "awk 'condicion {accion}' archivo",
    detail:
      "Lenguaje de procesamiento por columnas. Potente para filtros complejos sin abrir Excel.",
    bioExample: "awk '$6 > 100 {print $1,$6}' blast.tsv"
  },
  {
    cmd: "sed",
    category: "Procesamiento",
    syntax: "sed 's/viejo/nuevo/g' archivo",
    detail:
      "Editor por flujo para reemplazos masivos o limpieza de texto.",
    bioExample: "sed 's/ /_/g' ids.txt > ids_limpios.txt"
  },
  {
    cmd: "find",
    category: "Busqueda",
    syntax: "find ruta -name '*.fastq.gz'",
    detail:
      "Busca archivos por nombre, extension, fecha o tamano dentro de carpetas profundas.",
    bioExample: "find . -name '*.bam' -size +1G"
  },
  {
    cmd: "tar",
    category: "Compresion",
    syntax: "tar -czvf archivo.tar.gz carpeta",
    detail:
      "Empaqueta y comprime directorios para respaldo o transferencia de resultados.",
    bioExample: "tar -czvf resultados_run1.tar.gz resultados_run1/"
  },
  {
    cmd: "gzip",
    category: "Compresion",
    syntax: "gzip archivo",
    detail:
      "Comprime archivos individuales. FastQ y VCF suelen manejarse en formato .gz.",
    bioExample: "gzip matriz_expresion.tsv"
  },
  {
    cmd: "zcat",
    category: "Compresion",
    syntax: "zcat archivo.gz | head",
    detail:
      "Permite visualizar contenido de .gz sin descomprimir a disco.",
    bioExample: "zcat lecturas.fastq.gz | head -n 12"
  },
  {
    cmd: "chmod",
    category: "Permisos",
    syntax: "chmod +x script.sh",
    detail:
      "Cambia permisos de ejecucion/lectura/escritura. Necesario para scripts de pipeline.",
    bioExample: "chmod +x ejecutar_pipeline.sh"
  },
  {
    cmd: "history",
    category: "Productividad",
    syntax: "history | tail -n 30",
    detail:
      "Muestra comandos usados. Facilita reproducibilidad y documentacion del analisis.",
    bioExample: "history > bitacora_comandos.txt"
  },
  {
    cmd: "uname",
    category: "Sistema",
    syntax: "uname -r",
    detail:
      "Muestra informacion del sistema y kernel. Util para documentar el entorno de ejecucion.",
    bioExample: "uname -r  # registrar version de kernel en el reporte"
  },
  {
    cmd: "date",
    category: "Sistema",
    syntax: "date",
    detail:
      "Imprime fecha y hora actual. Se usa para sellar temporalmente ejecuciones o logs.",
    bioExample: "date >> logs/pipeline.log"
  },
  {
    cmd: "df",
    category: "Disco",
    syntax: "df -h",
    detail:
      "Muestra el espacio libre y usado en discos montados en formato legible.",
    bioExample: "df -h  # validar espacio antes de ensamblaje"
  },
  {
    cmd: "du",
    category: "Disco",
    syntax: "du -sh carpeta",
    detail:
      "Calcula el tamano de directorios para detectar resultados pesados y limpiar.",
    bioExample: "du -sh resultados/*"
  },
  {
    cmd: "ps",
    category: "Procesos",
    syntax: "ps -eaf",
    detail:
      "Lista procesos activos. Ayuda a revisar si una herramienta de bioinformatica sigue corriendo.",
    bioExample: "ps -eaf | grep fastqc"
  },
  {
    cmd: "top",
    category: "Procesos",
    syntax: "top",
    detail:
      "Monitor en vivo de CPU y memoria. Ideal para vigilar ejecuciones pesadas.",
    bioExample: "top  # monitorear consumo durante alineamiento"
  },
  {
    cmd: "kill",
    category: "Procesos",
    syntax: "kill -9 PID",
    detail:
      "Termina procesos colgados o que consumen recursos excesivos.",
    bioExample: "kill -9 24510"
  },
  {
    cmd: "free",
    category: "Procesos",
    syntax: "free -m",
    detail:
      "Muestra estado de memoria RAM en megabytes para diagnostico rapido.",
    bioExample: "free -m"
  },
  {
    cmd: "whoami",
    category: "Sistema",
    syntax: "whoami",
    detail:
      "Indica el usuario actual en terminal, util al trabajar en servidores compartidos.",
    bioExample: "whoami"
  },
  {
    cmd: "zip",
    category: "Compresion",
    syntax: "zip -r archivo.zip carpeta",
    detail:
      "Comprime multiples archivos en formato zip para compartir resultados.",
    bioExample: "zip -r entrega_informe.zip resultados_finales/"
  },
  {
    cmd: "unzip",
    category: "Compresion",
    syntax: "unzip archivo.zip",
    detail:
      "Descomprime paquetes zip recibidos desde colaboradores o repositorios.",
    bioExample: "unzip dataset_control.zip"
  },
  {
    cmd: "ln -s",
    category: "Archivos",
    syntax: "ln -s origen enlace",
    detail:
      "Crea enlaces simbolicos para organizar pipelines sin duplicar archivos pesados.",
    bioExample: "ln -s /datos/raw/PAC001_R1.fastq.gz raw_data/PAC001_R1.fastq.gz"
  },
  {
    cmd: "chown",
    category: "Permisos",
    syntax: "chown usuario:grupo archivo",
    detail:
      "Cambia propietario y grupo de archivos. Frecuente en servidores Linux multiusuario.",
    bioExample: "sudo chown bioinfo:bioinfo resultados/*.vcf"
  },
  {
    cmd: "chgrp",
    category: "Permisos",
    syntax: "chgrp grupo archivo",
    detail:
      "Cambia grupo asociado a archivos para trabajo colaborativo.",
    bioExample: "chgrp laboratorio shared/tabla_variantes.tsv"
  },
  {
    cmd: "wget",
    category: "Red",
    syntax: "wget URL",
    detail:
      "Descarga archivos desde internet o repositorios remotos en modo terminal.",
    bioExample: "wget https://ejemplo.org/referencia.fasta.gz"
  },
  {
    cmd: "curl",
    category: "Red",
    syntax: "curl -L URL -o archivo",
    detail:
      "Permite descargar datos y consultar APIs bioinformaticas por HTTP.",
    bioExample: "curl -L https://ejemplo.org/genes.tsv -o genes.tsv"
  },
  {
    cmd: "sort | uniq",
    category: "Tabulares",
    syntax: "sort archivo | uniq -c",
    detail:
      "Combinacion clasica para resumir ocurrencias de valores repetidos.",
    bioExample: "cut -f3 muestras.tsv | sort | uniq -c"
  }
];

const cliSimulatedOutput = {
  "pwd": "/home/user/proyecto_bioinfo",
  "ls -lah": "drwxr-xr-x raw_data\n-rw-r--r-- metadata.tsv\n-rw-r--r-- README.md\ndrwxr-xr-x results",
  "grep \"^>\" secuencias.fasta | wc -l": "245",
  "find . -name \"*.fastq.gz\"": "./raw_data/PAC001_R1.fastq.gz\n./raw_data/PAC001_R2.fastq.gz\n./raw_data/PAC002_R1.fastq.gz",
  "zcat muestra.fastq.gz | head -n 8": "@SEQ_ID\nGATCTGACTGAT\n+\nIIIIIIIIIIII",
  "df -h": "Filesystem      Size  Used Avail Use%\n/dev/sda2       250G  120G  118G  51%",
  "du -sh resultados": "1.8G    resultados",
  "ps -eaf | grep fastqc": "user  18210  1  35  fastqc PAC001_R1.fastq.gz",
  "free -m": "Mem: 15872 total, 7820 used, 7521 free",
  "tar -czvf resultados.tar.gz resultados/": "resultados/qc/\nresultados/variants/\nresultados/logs/"
};

const cliLineByLineExamples = {
  "grep \"^>\" secuencias.fasta | wc -l": {
    title: "Contar secuencias en FASTA",
    lines: [
      {
        code: "grep \"^>\" secuencias.fasta",
        explain: "Filtra las lineas que empiezan por >, que son las cabeceras de cada secuencia."
      },
      {
        code: "| wc -l",
        explain: "Cuenta cuantas cabeceras encontro grep; ese numero equivale al total de secuencias."
      }
    ],
    output: "245"
  },
  "find . -name \"*.fastq.gz\"": {
    title: "Buscar lecturas comprimidas",
    lines: [
      {
        code: "find .",
        explain: "Busca desde el directorio actual de forma recursiva."
      },
      {
        code: "-name \"*.fastq.gz\"",
        explain: "Filtra solo archivos con extension fastq.gz."
      }
    ],
    output: "./raw_data/PAC001_R1.fastq.gz\n./raw_data/PAC001_R2.fastq.gz"
  },
  "zcat muestra.fastq.gz | head -n 8": {
    title: "Ver FASTQ comprimido sin descomprimir",
    lines: [
      {
        code: "zcat muestra.fastq.gz",
        explain: "Descomprime en memoria y envia el contenido al siguiente comando."
      },
      {
        code: "| head -n 8",
        explain: "Muestra solo las primeras 8 lineas para inspeccion rapida."
      }
    ],
    output: "@SEQ_ID\nACTG...\n+\nIIII..."
  },
  "awk '$6 > 100 {print $1,$6}' blast.tsv": {
    title: "Filtrar hits con score alto",
    lines: [
      {
        code: "awk '$6 > 100 {print $1,$6}' blast.tsv",
        explain: "Selecciona filas donde la columna 6 sea mayor a 100 e imprime ID y score."
      }
    ],
    output: "seq_001 478\nseq_014 301"
  },
  "df -h": {
    title: "Revisar espacio de disco",
    lines: [
      {
        code: "df",
        explain: "Muestra informacion del sistema de archivos montado."
      },
      {
        code: "-h",
        explain: "Presenta tamanos en formato legible (GB, MB)."
      }
    ],
    output: "/dev/sda2 250G 120G 118G 51%"
  },
  "du -sh resultados": {
    title: "Medir peso de carpeta de resultados",
    lines: [
      {
        code: "du",
        explain: "Calcula uso de disco por directorio o archivo."
      },
      {
        code: "-sh resultados",
        explain: "S resume el total y h lo hace legible."
      }
    ],
    output: "1.8G resultados"
  }
};

const ubuntuCommandReference = {
  "Informacion del sistema": [
    ["arch", "Mostrar arquitectura de la maquina."],
    ["uname -m", "Mostrar arquitectura de CPU."],
    ["uname -r", "Mostrar version del kernel."],
    ["dmidecode -q", "Mostrar componentes de hardware (requiere sudo)."],
    ["hdparm -i /dev/sda", "Mostrar caracteristicas del disco."],
    ["hdparm -tT /dev/sda", "Probar velocidad de lectura del disco."],
    ["cat /proc/cpuinfo", "Mostrar informacion de CPU."],
    ["cat /proc/interrupts", "Mostrar interrupciones del sistema."],
    ["cat /proc/meminfo", "Mostrar uso de memoria."],
    ["cat /proc/swaps", "Mostrar ficheros/particiones swap."],
    ["cat /proc/version", "Mostrar version de kernel y compilador."],
    ["cat /proc/net/dev", "Mostrar interfaces de red y estadisticas."],
    ["cat /proc/mounts", "Mostrar sistemas de ficheros montados."],
    ["lspci -tv", "Mostrar dispositivos PCI."],
    ["lsusb -tv", "Mostrar dispositivos USB."],
    ["date", "Mostrar fecha del sistema."],
    ["cal 2011", "Mostrar calendario del anio indicado."],
    ["cal 07 2011", "Mostrar calendario del mes y anio."],
    ["date 041217002011.00", "Ajustar fecha/hora (uso administrativo)."],
    ["clock -w", "Guardar fecha en BIOS/RTC (segun sistema)."]
  ],
  "Apagar y reiniciar": [
    ["shutdown -h now", "Apagar sistema inmediatamente."],
    ["init 0", "Apagar sistema (compatibilidad SysV)."],
    ["telinit 0", "Apagar sistema (compatibilidad SysV)."],
    ["halt", "Apagar el sistema."],
    ["shutdown -h 22:30", "Programar apagado a hora definida."],
    ["shutdown -c", "Cancelar apagado programado."],
    ["shutdown -r now", "Reiniciar inmediatamente."],
    ["reboot", "Reiniciar sistema."],
    ["logout", "Cerrar sesion actual."]
  ],
  "Archivos y directorios": [
    ["cd /home", "Entrar al directorio /home."],
    ["cd ..", "Subir un nivel de directorio."],
    ["cd ../..", "Subir dos niveles."],
    ["cd ~user1", "Ir al home de user1."],
    ["cd -", "Volver al directorio anterior."],
    ["pwd", "Mostrar ruta del directorio actual."],
    ["ls", "Listar archivos de directorio."],
    ["ls -F", "Listar tipo de archivo con sufijos."],
    ["ls -l", "Listar con detalle."],
    ["ls -a", "Listar incluyendo ocultos."],
    ["tree", "Mostrar estructura de directorios en arbol."],
    ["mkdir dir1", "Crear directorio dir1."],
    ["mkdir -p /tmp/dir1/dir2", "Crear arbol de directorios."],
    ["rm -f file1", "Borrar archivo file1 forzando."],
    ["rmdir dir1", "Borrar directorio vacio."],
    ["rm -rf dir1", "Borrar directorio y contenido (peligroso)."],
    ["mv dir1 new_dir", "Renombrar o mover directorio."],
    ["cp file1 file2", "Copiar file1 a file2."],
    ["cp -a dir1 dir2", "Copiar directorio preservando atributos."],
    ["ln -s file1 lnk1", "Crear enlace simbolico."],
    ["ln file1 lnk1", "Crear enlace duro."],
    ["touch -t 0712250000 file1", "Ajustar marca de tiempo de archivo."],
    ["file file1", "Mostrar tipo de archivo."],
    ["iconv -l", "Listar codificaciones soportadas."],
    ["iconv -f UTF-8 -t ISO-8859-1 in.txt > out.txt", "Convertir codificacion de texto."]
  ],
  "Encontrar archivos": [
    ["find / -name file1", "Buscar archivo desde raiz."],
    ["find / -user user1", "Buscar archivos de un usuario."],
    ["find /home/user1 -name \"*.bin\"", "Buscar por extension."],
    ["find /usr/bin -type f -atime +100", "Buscar ficheros no accedidos recientemente."],
    ["find /usr/bin -type f -mtime -10", "Buscar ficheros modificados en ultimos dias."],
    ["find / -name \"*.rpm\" -exec chmod 755 {} \\;", "Buscar y cambiar permisos."],
    ["find / -xdev -name \"*.rpm\"", "Buscar ignorando otros dispositivos."],
    ["locate \"*.ps\"", "Buscar por indice de base de datos locate."],
    ["whereis halt", "Ubicar binario, man y fuente de comando."],
    ["which halt", "Mostrar ruta del ejecutable."],
    ["mount /dev/sda1 /mnt/usbdisk", "Montar dispositivo."],
    ["umount /dev/sda1", "Desmontar dispositivo."]
  ],
  "Espacio de disco": [
    ["df -h", "Ver particiones montadas y uso de disco."],
    ["ls -lSr | more", "Ordenar archivos por tamano."],
    ["du -sh dir1", "Espacio total usado por directorio."],
    ["du -sk * | sort -rn", "Ordenar tamano de carpetas."],
    ["dpkg-query -W -f='${Installed-Size}\\t${Package}\\n' | sort -k1,1n", "Uso de espacio por paquetes en Debian/Ubuntu."]
  ],
  "Usuarios y grupos": [
    ["groupadd nombre_grupo", "Crear grupo."],
    ["groupdel nombre_grupo", "Eliminar grupo."],
    ["groupmod -n nuevo viejo", "Renombrar grupo."],
    ["useradd user1", "Crear usuario."],
    ["userdel -r user1", "Eliminar usuario y home."],
    ["usermod -d /ftp/user1 -s /bin/nologin user1", "Modificar atributos de usuario."],
    ["passwd", "Cambiar contrasena del usuario actual."],
    ["passwd user1", "Cambiar contrasena de otro usuario (root)."],
    ["chage -E 2011-12-31 user1", "Definir fecha de expiracion."],
    ["pwck", "Verificar /etc/passwd."],
    ["grpck", "Verificar /etc/group."],
    ["newgrp group_name", "Cambiar grupo primario de sesion."]
  ],
  "Permisos y atributos": [
    ["ls -lh", "Ver permisos y tamanos legibles."],
    ["chmod ugo+rwx directory1", "Asignar permisos rwx a todos."],
    ["chmod go-rwx directory1", "Quitar permisos a grupo y otros."],
    ["chown user1 file1", "Cambiar propietario."],
    ["chown -R user1 directory1", "Cambiar propietario recursivamente."],
    ["chgrp group1 file1", "Cambiar grupo."],
    ["chown user1:group1 file1", "Cambiar usuario y grupo."],
    ["find / -perm -u+s", "Buscar ficheros con SUID."],
    ["chmod u+s /bin/file1", "Activar bit SUID."],
    ["chmod g+s /home/public", "Activar bit SGID."],
    ["chmod o+t /home/public", "Activar sticky bit."],
    ["chattr +i file1", "Hacer archivo inmutable."],
    ["chattr +a file1", "Permitir solo append."],
    ["lsattr", "Ver atributos especiales."]
  ],
  "Compresion y empaquetado": [
    ["bunzip2 file1.bz2", "Descomprimir bz2."],
    ["bzip2 file1", "Comprimir bz2."],
    ["gunzip file1.gz", "Descomprimir gzip."],
    ["gzip -9 file1", "Comprimir con maximo nivel."],
    ["tar -cvf archive.tar file1", "Crear tar sin compresion."],
    ["tar -xvf archive.tar", "Extraer tar."],
    ["tar -cvfz archive.tar.gz dir1", "Crear tar.gz."],
    ["tar -xvfz archive.tar.gz", "Extraer tar.gz."],
    ["zip -r file1.zip dir1", "Comprimir zip recursivo."],
    ["unzip file1.zip", "Descomprimir zip."]
  ],
  "Paquetes Debian/Ubuntu (APT/DPKG)": [
    ["dpkg -i package.deb", "Instalar paquete .deb."],
    ["dpkg -r package_name", "Eliminar paquete."],
    ["dpkg -l", "Listar paquetes instalados."],
    ["dpkg -s package_name", "Ver detalle de paquete."],
    ["dpkg -L package_name", "Listar archivos instalados por paquete."],
    ["dpkg -S /bin/ping", "Encontrar paquete que contiene archivo."],
    ["apt-get update", "Actualizar indice de paquetes."],
    ["apt-get upgrade", "Actualizar paquetes instalados."],
    ["apt-get install package_name", "Instalar paquete."],
    ["apt-get remove package_name", "Eliminar paquete."],
    ["apt-get clean", "Limpiar cache de paquetes."],
    ["apt-cache search searched-package", "Buscar paquetes por nombre."]
  ],
  "Contenido y texto": [
    ["cat file1", "Mostrar contenido completo."],
    ["tac file1", "Mostrar contenido de abajo hacia arriba."],
    ["more file1", "Visualizar contenido paginado."],
    ["less file1", "Visualizar contenido paginado con navegacion."],
    ["head -2 file1", "Mostrar primeras lineas."],
    ["tail -2 file1", "Mostrar ultimas lineas."],
    ["tail -f /var/log/messages", "Seguimiento en tiempo real de log."],
    ["grep '^Aug' /var/log/messages", "Buscar lineas por patron."],
    ["grep [0-9] /var/log/messages", "Buscar lineas con numeros."],
    ["sed 's/string1/string2/g' example.txt", "Reemplazo global en texto."],
    ["sed '/^$/d' example.txt", "Eliminar lineas en blanco."],
    ["echo 'texto' | tr '[:lower:]' '[:upper:]'", "Convertir minusculas a mayusculas."],
    ["sed -e '1d' result.txt", "Eliminar primera linea."],
    ["sed -n '/string1/p' result.txt", "Imprimir lineas que coinciden."]
  ],
  "Red y monitoreo": [
    ["ip link show", "Estado de interfaces de red."],
    ["ifconfig eth0", "Configuracion de interfaz (legacy)."],
    ["route -n", "Tabla de rutas."],
    ["netstat -tup", "Conexiones activas y procesos."],
    ["netstat -tupl", "Puertos en escucha."],
    ["tcpdump tcp port 80", "Capturar trafico HTTP."],
    ["iwlist scan", "Escanear redes Wi-Fi."],
    ["top", "Monitor de procesos en tiempo real."],
    ["ps -eafw", "Listado detallado de procesos."],
    ["pstree", "Arbol de procesos."],
    ["kill -9 PID", "Finalizar proceso forzado."],
    ["watch -n1 'cat /proc/interrupts'", "Monitoreo periodico de comando."],
    ["free -m", "Estado de RAM en MB."],
    ["lsof -p $$", "Archivos abiertos por proceso actual."],
    ["strace -c ls >/dev/null", "Resumen de llamadas al sistema."]
  ]
};

const bioCliThematicLibrary = {
  "Fundamentos Ubuntu en laboratorio": [
    {
      cmd: "pwd",
      purpose: "Confirmar en que carpeta estas antes de correr un pipeline.",
      bioCase: "Evita ejecutar comandos fuera de tu proyecto.",
      output: "/home/bioinfo/proyectos/microbioma_2026"
    },
    {
      cmd: "ls -lah",
      purpose: "Inspeccionar archivos, permisos y tamanos.",
      bioCase: "Verifica si FASTQ/FASTA llegaron completos.",
      output: "drwxr-xr-x raw_data\n-rw-r--r-- metadata.tsv\n-rw-r--r-- README.md"
    },
    {
      cmd: "mkdir -p proyecto/{raw,clean,results,logs,scripts}",
      purpose: "Crear estructura reproducible de analisis.",
      bioCase: "Estandariza carpetas para todas las corridas.",
      output: "(sin salida si se crea correctamente)"
    }
  ],
  "FASTA y FASTQ (inspeccion y QA rapida)": [
    {
      cmd: "grep '^>' secuencias.fasta | wc -l",
      purpose: "Contar secuencias en FASTA.",
      bioCase: "Validar si el numero de entradas coincide con lo esperado.",
      output: "245"
    },
    {
      cmd: "zcat muestra_R1.fastq.gz | head -n 12",
      purpose: "Ver lecturas comprimidas sin descomprimir en disco.",
      bioCase: "Inspeccion inicial para detectar formato correcto.",
      output: "@NB551068...\nGATCTGACTG...\n+\nIIIIIIIIIIII..."
    },
    {
      cmd: "zcat muestra_R1.fastq.gz | wc -l",
      purpose: "Contar lineas de FASTQ.",
      bioCase: "El total de lecturas se estima como lineas/4.",
      output: "4800000"
    }
  ],
  "Filtrado tabular y transformacion": [
    {
      cmd: "cut -f1,6 blast.tsv | head",
      purpose: "Extraer columnas clave de resultados BLAST.",
      bioCase: "Conservar identificador y score para analisis rapido.",
      output: "seq_001\t478\nseq_014\t301"
    },
    {
      cmd: "awk '$6 >= 100 {print $1,$6}' blast.tsv",
      purpose: "Filtrar por umbral en columna numerica.",
      bioCase: "Separar hits de alta confianza.",
      output: "seq_001 478\nseq_014 301\nseq_099 210"
    },
    {
      cmd: "sort -k2,2gr blast_scores.tsv | head",
      purpose: "Ordenar de mayor a menor por score.",
      bioCase: "Priorizar mejores alineamientos.",
      output: "seq_001\t478\nseq_014\t301\nseq_099\t210"
    }
  ],
  "Busqueda de archivos y control de lotes": [
    {
      cmd: "find . -name '*.fastq.gz'",
      purpose: "Localizar lecturas en arboles de carpetas profundos.",
      bioCase: "Armar lotes para QC o trimming automaticamente.",
      output: "./raw/PAC001_R1.fastq.gz\n./raw/PAC001_R2.fastq.gz"
    },
    {
      cmd: "for f in raw/*_R1.fastq.gz; do echo \"$f\"; done",
      purpose: "Recorrer multiples muestras desde shell.",
      bioCase: "Base de automatizacion para pipelines por lote.",
      output: "raw/PAC001_R1.fastq.gz\nraw/PAC002_R1.fastq.gz"
    },
    {
      cmd: "history | tail -n 20",
      purpose: "Registrar trazabilidad de comandos recientes.",
      bioCase: "Documentar reproducibilidad de una corrida.",
      output: "184 grep '^>' secuencias.fasta | wc -l\n185 zcat PAC001_R1.fastq.gz | head"
    }
  ],
  "Recursos, procesos y seguridad operativa": [
    {
      cmd: "df -h",
      purpose: "Ver espacio disponible en disco.",
      bioCase: "Confirmar capacidad antes de ensamblaje/alineamiento.",
      output: "/dev/sda2  250G 120G 118G 51%"
    },
    {
      cmd: "du -sh results/*",
      purpose: "Medir peso de carpetas de salida.",
      bioCase: "Detectar etapas que consumen mas almacenamiento.",
      output: "780M results/01_qc\n4.2G results/03_alignment"
    },
    {
      cmd: "ps -eaf | grep fastqc",
      purpose: "Ver si procesos siguen activos.",
      bioCase: "Monitorear ejecuciones largas en servidor.",
      output: "bio 18210 1 35 fastqc PAC001_R1.fastq.gz"
    }
  ],
  "Comandos nucleo en genomica (samtools/bcftools)": [
    {
      cmd: "samtools flagstat muestra.bam",
      purpose: "Resumen de calidad y mapeo de lecturas alineadas.",
      bioCase: "Control rapido despues de alineamiento.",
      output: "2450000 + 0 in total\n2300000 + 0 mapped (93.88%)"
    },
    {
      cmd: "samtools index muestra.bam",
      purpose: "Crear indice BAM para acceso aleatorio.",
      bioCase: "Requisito para visualizacion y consultas por region.",
      output: "(genera muestra.bam.bai)"
    },
    {
      cmd: "bcftools view -i 'QUAL>=20' variantes.vcf.gz | head",
      purpose: "Filtrar variantes por calidad.",
      bioCase: "Reducir falsos positivos en VCF preliminar.",
      output: "#CHROM POS ID REF ALT QUAL FILTER INFO\nchr1 10583 . G A 63 PASS ..."
    }
  ]
};

function getAllReferenceCommands() {
  return Object.entries(ubuntuCommandReference).flatMap(([group, entries]) =>
    entries.map(([cmd, desc]) => ({ group, cmd, desc }))
  );
}

const moduleData = {
  cli: {
    title: "Linea de comando para bioinformatica",
    description:
      "Modulo completamente renovado para Ubuntu y bioinformatica: fundamentos reales de shell, manejo de FASTA/FASTQ/VCF/BAM, automatizacion reproducible y biblioteca tematica de comandos con evidencia de salida.",
    lesson: `
<div class="lesson">
  <h3>Investigacion aplicada: por que Ubuntu CLI es central en bioinformatica</h3>
  <p>El trabajo bioinformatico moderno se ejecuta mayoritariamente desde linea de comando porque permite <b>reproducibilidad</b>, <b>escalabilidad</b> y <b>automatizacion</b>. Ubuntu y distribuciones Linux compatibles son estandar en laboratorios y servidores HPC.</p>
  <p>Este modulo se reconstruyo desde cero con base en practicas de terminal de Ubuntu, procesamiento de texto Unix y flujos de genomica con herramientas CLI de uso real.</p>
  <p><b>Estructura profesional minima de proyecto:</b></p>
  <div class="code">proyecto_bioinfo/
  raw_data/            # datos originales, no se editan
  metadata/            # metadatos de muestras
  reference/           # genoma/transcriptoma de referencia
  env/                 # entorno/conda o contenedores
  scripts/             # scripts .sh, .py, .R
  results/
    01_qc/
    02_trimming/
    03_alignment/
    04_variants/
  logs/
  reports/</div>
  <p><b>Conceptos indispensables:</b> rutas absolutas/relativas, permisos, redirecciones (<code>&gt;</code>, <code>&gt;&gt;</code>), tuberias (<code>|</code>), codigos de salida y bitacora de ejecucion.</p>
</div>

<div class="lesson">
  <h3>Ruta de dominio tecnico (profunda y progresiva)</h3>
  <ol>
    <li><b>Base Ubuntu:</b> shell, rutas, permisos, jerarquia de directorios y ayuda con <code>man</code>.</li>
    <li><b>Inspeccion de datos:</b> validar integridad de FASTA/FASTQ/TSV/VCF con <code>head</code>, <code>wc</code>, <code>grep</code>.</li>
    <li><b>Procesamiento textual:</b> filtros con <code>awk</code>, <code>cut</code>, <code>sort</code>, <code>uniq</code>, <code>sed</code>.</li>
    <li><b>Automatizacion:</b> bucles, redirecciones y scripts para ejecutar lotes de muestras.</li>
    <li><b>Operacion en servidor:</b> monitoreo de recursos con <code>df</code>, <code>du</code>, <code>ps</code>, <code>top</code>.</li>
    <li><b>Genomica CLI:</b> manejo inicial de BAM/VCF con <code>samtools</code> y <code>bcftools</code>.</li>
  </ol>
</div>

<div class="lesson">
  <h3>Patrones de trabajo bioinformatico en terminal</h3>
  <ul>
    <li><b>Control de entrada:</b> confirmar formato, numero de registros y consistencia de metadatos.</li>
    <li><b>Transformacion segura:</b> nunca editar crudos, escribir salidas en carpetas versionadas.</li>
    <li><b>Ejecucion por lotes:</b> mismo flujo para todas las muestras, cambiando solo variables.</li>
    <li><b>Trazabilidad:</b> conservar comandos, versiones y logs de errores/salidas.</li>
  </ul>
  <div class="code">Ejemplo reproducible minimo:
date > logs/run_01.log
pwd >> logs/run_01.log
grep "^>" reference/transcriptoma.fasta | wc -l >> logs/run_01.log
zcat raw_data/PAC001_R1.fastq.gz | head -n 12 > reports/PAC001_preview.txt</div>
</div>

<div class="lesson">
  <h3>Resultados de aprendizaje del nuevo modulo</h3>
  <ul>
    <li>Diagnosticar rapidamente si un dataset de secuenciacion esta listo para analisis.</li>
    <li>Filtrar y resumir archivos biologicos desde terminal sin depender de interfaces graficas.</li>
    <li>Construir mini pipelines reproducibles en Ubuntu para lotes de muestras.</li>
    <li>Documentar comandos y recursos para auditoria cientifica y repetibilidad.</li>
  </ul>
</div>

<div class="lesson">
  <h3>Capturas de comandos y salidas reales simuladas</h3>
  <p>Las siguientes capturas representan sesiones didacticas en terminal Ubuntu: inspeccion de FASTQ, filtrado, monitoreo de procesos y empaquetado de resultados.</p>
  <div class="cli-gallery">
    <figure class="cli-shot">
      <img src="assets/cli-screenshot-1.svg" alt="Captura terminal navegacion e inspeccion">
      <figcaption>Navegacion e inspeccion inicial de archivos FASTQ.</figcaption>
    </figure>
    <figure class="cli-shot">
      <img src="assets/cli-screenshot-2.svg" alt="Captura terminal busqueda y filtrado">
      <figcaption>Busqueda y filtrado de secuencias con grep/find/awk.</figcaption>
    </figure>
    <figure class="cli-shot">
      <img src="assets/cli-screenshot-3.svg" alt="Captura terminal procesos y permisos">
      <figcaption>Monitoreo de procesos, memoria y ejecucion de scripts.</figcaption>
    </figure>
    <figure class="cli-shot">
      <img src="assets/cli-screenshot-4.svg" alt="Captura terminal compresion de resultados">
      <figcaption>Compresion y control de espacio de disco en resultados.</figcaption>
    </figure>
  </div>
</div>

<div class="lesson">
  <h3>Biblioteca tematica CLI para bioinformatica</h3>
  <p>Se organizo por escenarios reales: fundamentos Ubuntu, FASTA/FASTQ, transformacion tabular, lotes y monitoreo, mas comandos nucleares en genomica.</p>
  <p><b>Nota:</b> en Ubuntu no existe una lista cerrada de comandos "totales". Esta biblioteca prioriza los comandos con mayor impacto practico en flujos bioinformaticos.</p>
  <div id="cliCoverageCount" class="code"></div>
</div>

<div class="lesson">
  <h3>Investigacion de referencia y consulta rapida</h3>
  <p>Esta seccion conecta la biblioteca bioinformatica con categorias amplias de Ubuntu para administracion y soporte tecnico.</p>
  <div class="interactive">
    <label for="cliRefGroup">Categoria:</label>
    <select id="cliRefGroup"></select>
    <label for="cliRefCommand">Comando:</label>
    <select id="cliRefCommand"></select>
    <button id="cliRefShowBtn">Mostrar explicacion y captura</button>
    <div id="cliRefDetail" class="code"></div>
    <div id="cliRefCapture" class="line-explain"></div>
  </div>
</div>

<div class="lesson">
  <h3>Buenas practicas obligatorias en laboratorio</h3>
  <ul>
    <li>Nunca modifiques <code>raw_data</code>; trabaja en copias procesadas.</li>
    <li>Registra comandos, version de herramientas y fecha/hora por corrida.</li>
    <li>Usa nombres consistentes de muestras (ej. <code>PAC001_R1.fastq.gz</code>).</li>
    <li>Valida salidas intermedias antes de avanzar al siguiente paso.</li>
    <li>Evita <code>rm -rf</code> en rutas ambiguas; confirma con <code>pwd</code> y <code>ls</code>.</li>
  </ul>
</div>
`,
    interactive: `
<div class="interactive">
  <h4>Fuentes tecnicas recomendadas para seguir profundizando</h4>
  <p><b>Ubuntu:</b> <a href="https://documentation.ubuntu.com/desktop/en/latest/tutorial/the-linux-command-line-for-beginners/" target="_blank" rel="noreferrer">Linux command line for beginners</a></p>
  <p><b>Ubuntu Community:</b> <a href="https://help.ubuntu.com/community/CommandLine" target="_blank" rel="noreferrer">CommandLine Wiki</a></p>
  <p><b>Manpage oficial:</b> <a href="https://manpages.ubuntu.com/manpages/lunar/man1/find.1.html" target="_blank" rel="noreferrer">find(1)</a></p>
  <p><b>Genomica CLI:</b> <a href="https://samtools.github.io/bcftools/howtos/" target="_blank" rel="noreferrer">BCFtools HowTo</a></p>
</div>

<div class="interactive">
  <h4>Planificador de estudio CLI (segun tiempo semanal)</h4>
  <label for="cliPlanHours">Horas por semana que puedes dedicar:</label>
  <select id="cliPlanHours">
    <option value="2">2 horas/semana</option>
    <option value="4">4 horas/semana</option>
    <option value="6">6 horas/semana</option>
    <option value="8">8+ horas/semana</option>
  </select>
  <button id="cliPlanBtn">Generar plan</button>
  <div id="cliPlanOutput" class="code">Selecciona tus horas y genera una ruta de trabajo.</div>
</div>

<div class="interactive">
  <h4>Biblioteca tematica de lineas de comando</h4>
  <label for="cliThemeSelect">Tema:</label>
  <select id="cliThemeSelect"></select>
  <label for="cliThemeCommandSelect">Comando:</label>
  <select id="cliThemeCommandSelect"></select>
  <button id="cliThemeShowBtn">Ver ficha tecnica y salida</button>
  <div id="cliThemeDetail" class="code"></div>
  <div id="cliThemeOutput" class="code"></div>
</div>

<div class="interactive">
  <h4>Terminal interactiva (simulada)</h4>
  <label for="cliTrySelect">Elige un comando y ejecútalo para ver salida simulada:</label>
  <select id="cliTrySelect">
    <option>pwd</option>
    <option>ls -lah</option>
    <option>grep "^>" secuencias.fasta | wc -l</option>
    <option>find . -name "*.fastq.gz"</option>
    <option>zcat muestra.fastq.gz | head -n 8</option>
    <option>df -h</option>
    <option>du -sh resultados</option>
    <option>ps -eaf | grep fastqc</option>
    <option>free -m</option>
    <option>tar -czvf resultados.tar.gz resultados/</option>
  </select>
  <button id="cliRunBtn">Ejecutar comando</button>
  <div id="cliRunOutput" class="code">$ _</div>
</div>

<div class="interactive">
  <h4>Captura explicativa linea por linea</h4>
  <label for="cliShotSelect">Selecciona un ejemplo para ver la captura guiada:</label>
  <select id="cliShotSelect">
    <option>grep "^>" secuencias.fasta | wc -l</option>
    <option>find . -name "*.fastq.gz"</option>
    <option>zcat muestra.fastq.gz | head -n 8</option>
    <option>awk '$6 > 100 {print $1,$6}' blast.tsv</option>
    <option>df -h</option>
    <option>du -sh resultados</option>
  </select>
  <button id="cliShotBtn">Mostrar captura explicada</button>
  <div id="cliShotTerminal" class="code">$ selecciona un ejemplo</div>
  <div id="cliShotExplain" class="line-explain"></div>
</div>

<div class="interactive">
  <h4>Explorador de comandos Unix/Linux para bioinformatica</h4>
  <label for="cliCommandSelect">Selecciona un comando para ver explicacion detallada:</label>
  <select id="cliCommandSelect"></select>
  <div id="cliCommandDetails" class="code"></div>
</div>

<div class="interactive">
  <h4>Simulador de reto 1</h4>
  <label for="cliInput">Escribe el comando para contar secuencias en FASTA:</label>
  <input id="cliInput" type="text" placeholder='Ejemplo: grep "^>" archivo.fasta | wc -l'>
  <button id="cliCheckBtn">Validar comando</button>
  <div id="cliFeedback" class="feedback" hidden></div>
</div>

<div class="interactive">
  <h4>Simulador de reto 2</h4>
  <label for="cliInput2">Escribe un comando para mostrar las primeras 12 lineas de un FASTQ comprimido:</label>
  <input id="cliInput2" type="text" placeholder="Ejemplo: zcat muestra.fastq.gz | head -n 12">
  <button id="cliCheckBtn2">Validar comando</button>
  <div id="cliFeedback2" class="feedback" hidden></div>
</div>
`,
    quiz: {
      question: "Que comando te permite contar cuantas secuencias hay en un archivo FASTA?",
      options: [
        { id: "a", text: "grep '^>' archivo.fasta | wc -l", correct: true },
        { id: "b", text: "ls -lah archivo.fasta", correct: false },
        { id: "c", text: "wc -l", correct: false }
      ]
    }
  },
  db: {
    title: "Busqueda en bases de datos biologicas",
    description:
      "Las bases de datos biologicas integran secuencias, anotaciones funcionales y metadatos. Aprender consultas efectivas reduce tiempo y mejora la calidad de resultados.",
    lesson: `
<div class="lesson">
  <h3>Conceptos clave</h3>
  <ul>
    <li><b>NCBI:</b> nucleotidos, proteinas, genomas y bibliografia.</li>
    <li><b>UniProt:</b> informacion curada de proteinas.</li>
    <li><b>ENA/SRA:</b> lecturas de secuenciacion crudas.</li>
    <li><b>Consultas:</b> usar operadores como <code>AND</code>, <code>OR</code>, comillas y filtros por organismo.</li>
  </ul>
  <div class="code">Ejemplo de consulta en NCBI:
"cytochrome c oxidase" AND "Theobroma grandiflorum"[Organism]</div>
</div>
`,
    interactive: `
<div class="interactive">
  <h4>Constructor de consulta</h4>
  <label for="geneInput">Gen o proteina:</label>
  <input id="geneInput" type="text" placeholder="Ej: cytochrome c oxidase">
  <label for="organismInput">Organismo:</label>
  <input id="organismInput" type="text" placeholder="Ej: Theobroma grandiflorum">
  <button id="dbBuildBtn">Generar consulta</button>
  <div id="dbResult" class="code"></div>
</div>
`,
    quiz: {
      question: "Que base de datos se especializa en informacion de proteinas?",
      options: [
        { id: "a", text: "UniProt", correct: true },
        { id: "b", text: "PubChem", correct: false },
        { id: "c", text: "GEO", correct: false }
      ]
    }
  },
  genomics: {
    title: "Genomica",
    description:
      "La genomica analiza el ADN completo de un organismo. Incluye etapas desde control de calidad hasta interpretacion biologica de variantes y genes.",
    lesson: `
<div class="lesson">
  <h3>Flujo estandar de analisis genomico</h3>
  <ol>
    <li><b>QC:</b> evaluar calidad de lecturas (ej. FastQC).</li>
    <li><b>Filtrado/recorte:</b> eliminar adaptadores y bases de baja calidad.</li>
    <li><b>Alineamiento o ensamblaje:</b> mapear contra referencia o ensamblar de novo.</li>
    <li><b>Anotacion:</b> identificar genes y funciones.</li>
    <li><b>Analisis de variantes:</b> SNPs, indels y su posible impacto.</li>
  </ol>
  <div class="code">Pipeline conceptual:
FASTQ -> QC -> trimming -> alignment -> variant calling -> annotation</div>
</div>
`,
    interactive: `
<div class="interactive">
  <h4>Ordena el pipeline genomico</h4>
  <p>Escribe el orden correcto separado por coma usando estas etapas:
  <code>QC, trimming, alignment, variant calling, annotation</code></p>
  <textarea id="genomicsOrder"></textarea>
  <button id="genomicsCheckBtn">Evaluar orden</button>
  <div id="genomicsFeedback" class="feedback" hidden></div>
</div>
`,
    quiz: {
      question: "Que etapa identifica SNPs e indels?",
      options: [
        { id: "a", text: "Variant calling", correct: true },
        { id: "b", text: "Trimming", correct: false },
        { id: "c", text: "FastQC", correct: false }
      ]
    }
  },
  phylo: {
    title: "Filogenetica",
    description:
      "La filogenetica infiere relaciones evolutivas. Combina alineamientos, modelos de sustitucion y metodos para reconstruir arboles robustos.",
    lesson: `
<div class="lesson">
  <h3>Etapas importantes</h3>
  <ol>
    <li><b>Alineamiento multiple:</b> MAFFT, Clustal Omega, MUSCLE.</li>
    <li><b>Seleccion de modelo:</b> escoger el modelo de evolucion apropiado.</li>
    <li><b>Inferencia de arbol:</b> Neighbor Joining, Maximum Likelihood, Bayesiano.</li>
    <li><b>Soporte de nodos:</b> bootstrap para evaluar confiabilidad.</li>
  </ol>
  <div class="code">Interpretacion:
Una rama corta suele indicar menor divergencia; bootstrap alto sugiere mayor soporte.</div>
</div>
`,
    interactive: `
<div class="interactive">
  <h4>Interpretacion rapida de arbol</h4>
  <label for="bootstrapInput">Si un nodo tiene bootstrap 95, como lo interpretas?</label>
  <input id="bootstrapInput" type="text" placeholder="Escribe tu interpretacion">
  <button id="phyloCheckBtn">Evaluar respuesta</button>
  <div id="phyloFeedback" class="feedback" hidden></div>
</div>
`,
    quiz: {
      question: "Que metodo de alineamiento multiple es comun en filogenetica?",
      options: [
        { id: "a", text: "MAFFT", correct: true },
        { id: "b", text: "BLASTP", correct: false },
        { id: "c", text: "Bowtie2", correct: false }
      ]
    }
  }
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      state.completed = { ...state.completed, ...parsed.completed };
      state.score = Number.isFinite(parsed.score) ? parsed.score : 0;
    }
  } catch {
    // Si el JSON falla, se ignora y se reinicia desde valores por defecto.
  }
}

function getCompletedCount() {
  return Object.values(state.completed).filter(Boolean).length;
}

function updateProgressUI() {
  const completedCount = getCompletedCount();
  const total = 4;
  document.getElementById("completedCount").textContent = String(completedCount);
  document.getElementById("scoreValue").textContent = String(state.score);
  const pct = Math.round((completedCount / total) * 100);
  document.getElementById("progressBar").style.width = `${pct}%`;
}

function markModuleDone(moduleKey) {
  if (!state.completed[moduleKey]) {
    state.completed[moduleKey] = true;
    state.score += 25;
    saveState();
    updateProgressUI();
  }
}

function renderQuiz(moduleKey, quiz) {
  const optionsHtml = quiz.options
    .map(
      (opt) =>
        `<button class="quizOptionBtn" data-module="${moduleKey}" data-correct="${opt.correct}">${opt.text}</button>`
    )
    .join("");
  return `
<div class="lesson">
  <h3>Mini quiz</h3>
  <p>${quiz.question}</p>
  <div class="quiz-choices">${optionsHtml}</div>
  <div id="quizFeedback" class="feedback" hidden></div>
  ${
    state.completed[moduleKey]
      ? '<span class="status">Modulo completado</span>'
      : ""
  }
</div>
`;
}

function renderModule(moduleKey) {
  const module = moduleData[moduleKey];
  const container = document.getElementById("moduleContent");
  container.classList.remove("hidden");
  container.innerHTML = `
    <h2>${module.title}</h2>
    <p>${module.description}</p>
    ${module.lesson}
    ${module.interactive}
    ${renderQuiz(moduleKey, module.quiz)}
  `;

  attachModuleHandlers(moduleKey);
  container.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setFeedback(el, ok, msg) {
  el.hidden = false;
  el.classList.remove("ok", "err");
  el.classList.add(ok ? "ok" : "err");
  el.textContent = msg;
}

function attachModuleHandlers(moduleKey) {
  if (moduleKey === "cli") {
    const planBtn = document.getElementById("cliPlanBtn");
    const planHours = document.getElementById("cliPlanHours");
    const planOutput = document.getElementById("cliPlanOutput");
    planBtn.addEventListener("click", () => {
      const h = Number(planHours.value);
      let plan = "";
      if (h <= 2) {
        plan =
          "Plan sugerido (2h/semana, 10 semanas):\n" +
          "Sem 1-2: navegacion, archivos y rutas.\n" +
          "Sem 3-4: grep/find/head/tail con archivos FASTA/FASTQ.\n" +
          "Sem 5-6: redireccion, pipes y filtros con awk/cut/sort.\n" +
          "Sem 7-8: permisos, procesos y compresion.\n" +
          "Sem 9-10: mini pipeline reproducible con bitacora.";
      } else if (h <= 4) {
        plan =
          "Plan sugerido (4h/semana, 7 semanas):\n" +
          "Sem 1: fundamentos + estructura de proyecto.\n" +
          "Sem 2: manipulacion de archivos biologicos.\n" +
          "Sem 3: busqueda y filtrado (grep/find/awk).\n" +
          "Sem 4: redireccion, pipes, alias.\n" +
          "Sem 5: permisos, variables y procesos.\n" +
          "Sem 6: compresion y automatizacion por lotes.\n" +
          "Sem 7: proyecto final CLI para bioinformatica.";
      } else if (h <= 6) {
        plan =
          "Plan sugerido (6h/semana, 5 semanas):\n" +
          "Semana 1: fundamentos, archivos, busqueda.\n" +
          "Semana 2: texto/tablas (grep, awk, cut, sort, uniq).\n" +
          "Semana 3: shell avanzado (pipes, redireccion, alias, scripts).\n" +
          "Semana 4: sistema (permisos, procesos, logs, compresion).\n" +
          "Semana 5: pipeline bioinformatico completo y documentado.";
      } else {
        plan =
          "Plan intensivo (8+ h/semana, 3-4 semanas):\n" +
          "Bloque A: fundamentos y comandos core.\n" +
          "Bloque B: procesamiento masivo de FASTA/FASTQ/VCF.\n" +
          "Bloque C: automatizacion con scripts + reportes reproducibles.\n" +
          "Bloque D: proyecto final con validacion y control de calidad.";
      }
      planOutput.textContent = plan;
    });

    const coverageBox = document.getElementById("cliCoverageCount");
    coverageBox.textContent =
      `Comandos de biblioteca CLI bioinformatica: ${cliCommandCatalog.length}\n` +
      `Temas especializados: ${Object.keys(bioCliThematicLibrary).length}\n` +
      "Cobertura: fundamentos Ubuntu, archivos FASTA/FASTQ, filtrado tabular, automatizacion por lotes, recursos de sistema y comandos nucleo para genomica.";

    const themeSelect = document.getElementById("cliThemeSelect");
    const themeCommandSelect = document.getElementById("cliThemeCommandSelect");
    const themeShowBtn = document.getElementById("cliThemeShowBtn");
    const themeDetail = document.getElementById("cliThemeDetail");
    const themeOutput = document.getElementById("cliThemeOutput");
    const themeKeys = Object.keys(bioCliThematicLibrary);
    themeSelect.innerHTML = themeKeys.map((x) => `<option value="${x}">${x}</option>`).join("");
    function loadThemeCommands(theme) {
      const items = bioCliThematicLibrary[theme] || [];
      themeCommandSelect.innerHTML = items
        .map((item) => `<option value="${item.cmd}">${item.cmd}</option>`)
        .join("");
    }
    function showThemeCommand(theme, cmd) {
      const items = bioCliThematicLibrary[theme] || [];
      const item = items.find((x) => x.cmd === cmd);
      if (!item) return;
      themeDetail.textContent =
        `Tema: ${theme}\n` +
        `Comando: ${item.cmd}\n` +
        `Para que sirve: ${item.purpose}\n` +
        `Caso bioinformatico: ${item.bioCase}`;
      themeOutput.textContent = `$ ${item.cmd}\n${item.output}`;
    }
    loadThemeCommands(themeKeys[0]);
    showThemeCommand(themeKeys[0], (bioCliThematicLibrary[themeKeys[0]] || [])[0]?.cmd);
    themeSelect.addEventListener("change", (e) => loadThemeCommands(e.target.value));
    themeShowBtn.addEventListener("click", () => {
      showThemeCommand(themeSelect.value, themeCommandSelect.value);
    });

    const refGroup = document.getElementById("cliRefGroup");
    const refCommand = document.getElementById("cliRefCommand");
    const refDetail = document.getElementById("cliRefDetail");
    const refCapture = document.getElementById("cliRefCapture");
    const refShowBtn = document.getElementById("cliRefShowBtn");
    const groups = Object.keys(ubuntuCommandReference);
    refGroup.innerHTML = groups.map((g) => `<option value="${g}">${g}</option>`).join("");
    function loadGroupCommands(groupName) {
      const entries = ubuntuCommandReference[groupName] || [];
      refCommand.innerHTML = entries
        .map(([cmd]) => `<option value="${cmd}">${cmd}</option>`)
        .join("");
    }
    loadGroupCommands(groups[0]);
    refGroup.addEventListener("change", (e) => loadGroupCommands(e.target.value));
    refShowBtn.addEventListener("click", () => {
      const groupName = refGroup.value;
      const entries = ubuntuCommandReference[groupName] || [];
      const selected = entries.find(([cmd]) => cmd === refCommand.value);
      if (!selected) return;
      const [cmd, desc] = selected;
      const total = getAllReferenceCommands().length;
      refDetail.textContent =
        `Categoria: ${groupName}\nComando: ${cmd}\nDescripcion: ${desc}\n\n` +
        `Total de comandos de referencia cargados en esta seccion: ${total}`;
      const parts = cmd.split(" ");
      refCapture.innerHTML =
        `<p><b>Captura explicativa simulada</b></p>` +
        `<p><code>$ ${cmd}</code></p>` +
        parts
          .map(
            (part, idx) =>
              `<p><b>Linea ${idx + 1}:</b> <code>${part}</code> - parte del comando que contribuye a la accion final.</p>`
          )
          .join("") +
        `<p><b>Resultado esperado:</b> ${desc}</p>`;
    });

    const commandSelect = document.getElementById("cliCommandSelect");
    const commandDetails = document.getElementById("cliCommandDetails");
    commandSelect.innerHTML = cliCommandCatalog
      .map((item) => `<option value="${item.cmd}">${item.cmd} (${item.category})</option>`)
      .join("");

    function renderCommandDetail(commandName) {
      const item = cliCommandCatalog.find((x) => x.cmd === commandName);
      if (!item) return;
      commandDetails.textContent =
        `Comando: ${item.cmd}\n` +
        `Categoria: ${item.category}\n` +
        `Sintaxis sugerida: ${item.syntax}\n\n` +
        `${item.detail}\n\n` +
        `Ejemplo en bioinformatica:\n${item.bioExample}`;
    }

    renderCommandDetail(cliCommandCatalog[0].cmd);
    commandSelect.addEventListener("change", (event) => {
      renderCommandDetail(event.target.value);
    });

    const runBtn = document.getElementById("cliRunBtn");
    const runSelect = document.getElementById("cliTrySelect");
    const runOutput = document.getElementById("cliRunOutput");
    runBtn.addEventListener("click", () => {
      const cmd = runSelect.value;
      const output = cliSimulatedOutput[cmd] || "Comando no reconocido en el simulador.";
      runOutput.textContent = `$ ${cmd}\n${output}`;
    });

    const shotSelect = document.getElementById("cliShotSelect");
    const shotBtn = document.getElementById("cliShotBtn");
    const shotTerminal = document.getElementById("cliShotTerminal");
    const shotExplain = document.getElementById("cliShotExplain");
    shotBtn.addEventListener("click", () => {
      const key = shotSelect.value;
      const data = cliLineByLineExamples[key];
      if (!data) return;
      shotTerminal.textContent = `$ ${key}\n${data.output}`;
      shotExplain.innerHTML = `
        <p><b>${data.title}</b></p>
        ${data.lines
          .map(
            (line, idx) =>
              `<p><b>Paso ${idx + 1}:</b> <code>${line.code}</code><br>${line.explain}</p>`
          )
          .join("")}
      `;
    });

    const btn = document.getElementById("cliCheckBtn");
    btn.addEventListener("click", () => {
      const input = document.getElementById("cliInput").value.toLowerCase().trim();
      const fb = document.getElementById("cliFeedback");
      const ok = input.includes("grep") && input.includes("^>") && input.includes("wc");
      if (ok) {
        setFeedback(
          fb,
          true,
          "Correcto. Usaste una estrategia adecuada para contar cabeceras FASTA."
        );
      } else {
        setFeedback(
          fb,
          false,
          'Intenta incluir: grep "^>" archivo.fasta | wc -l'
        );
      }
    });

    const btn2 = document.getElementById("cliCheckBtn2");
    btn2.addEventListener("click", () => {
      const input2 = document.getElementById("cliInput2").value.toLowerCase().trim();
      const fb2 = document.getElementById("cliFeedback2");
      const ok2 =
        (input2.includes("zcat") || input2.includes("gunzip -c")) &&
        input2.includes("head") &&
        (input2.includes("-n 12") || input2.includes("-12"));
      if (ok2) {
        setFeedback(
          fb2,
          true,
          "Correcto. Tu comando permite inspeccionar un FASTQ comprimido sin descomprimir a disco."
        );
      } else {
        setFeedback(
          fb2,
          false,
          "Sugerencia: zcat muestra.fastq.gz | head -n 12"
        );
      }
    });
  }

  if (moduleKey === "db") {
    const btn = document.getElementById("dbBuildBtn");
    const result = document.getElementById("dbResult");
    result.textContent = "La consulta generada aparecera aqui.";
    btn.addEventListener("click", () => {
      const gene = document.getElementById("geneInput").value.trim();
      const organism = document.getElementById("organismInput").value.trim();
      if (!gene || !organism) {
        result.textContent = "Completa ambos campos para construir la consulta.";
        return;
      }
      result.textContent = `"${gene}" AND "${organism}"[Organism]`;
    });
  }

  if (moduleKey === "genomics") {
    const btn = document.getElementById("genomicsCheckBtn");
    btn.addEventListener("click", () => {
      const val = document
        .getElementById("genomicsOrder")
        .value.toLowerCase()
        .replace(/\s+/g, "");
      const fb = document.getElementById("genomicsFeedback");
      const target = "qc,trimming,alignment,variantcalling,annotation";
      if (val === target) {
        setFeedback(
          fb,
          true,
          "Excelente. Orden correcto del pipeline genomico."
        );
      } else {
        setFeedback(
          fb,
          false,
          "Orden sugerido: QC, trimming, alignment, variant calling, annotation."
        );
      }
    });
  }

  if (moduleKey === "phylo") {
    const btn = document.getElementById("phyloCheckBtn");
    btn.addEventListener("click", () => {
      const val = document.getElementById("bootstrapInput").value.toLowerCase();
      const fb = document.getElementById("phyloFeedback");
      const ok = val.includes("alto") || val.includes("confiable") || val.includes("soporte");
      if (ok) {
        setFeedback(
          fb,
          true,
          "Bien interpretado. Un bootstrap de 95 indica fuerte soporte para ese nodo."
        );
      } else {
        setFeedback(
          fb,
          false,
          "Pista: bootstrap 95 suele interpretarse como alto soporte estadistico."
        );
      }
    });
  }

  document.querySelectorAll(".quizOptionBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const isCorrect = btn.dataset.correct === "true";
      const module = btn.dataset.module;
      const fb = document.getElementById("quizFeedback");
      if (isCorrect) {
        setFeedback(fb, true, "Respuesta correcta. Modulo completado.");
        markModuleDone(module);
      } else {
        setFeedback(fb, false, "Respuesta incorrecta. Intenta de nuevo.");
      }
    });
  });
}

function bindGlobalEvents() {
  document.getElementById("goToModulesBtn").addEventListener("click", () => {
    document.getElementById("modules").scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("resetProgressBtn").addEventListener("click", () => {
    state.completed = { cli: false, db: false, genomics: false, phylo: false };
    state.score = 0;
    saveState();
    updateProgressUI();
    alert("Progreso reiniciado.");
  });

  document.querySelectorAll(".openModuleBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      renderModule(btn.dataset.module);
    });
  });
}

function init() {
  loadState();
  updateProgressUI();
  bindGlobalEvents();
}

init();
