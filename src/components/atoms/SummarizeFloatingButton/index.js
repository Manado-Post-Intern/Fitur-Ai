import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, Text, StyleSheet} from 'react-native';
import {
  IcSummarizeSpark,
  IcPopUpExit,
  IcPopUpPause,
  IcPopUpPlay,
  IcSumStop,
} from '../../../assets';

const SummarizeFloatingButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // tambahan logika buat play pause audio
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.floatingButton} onPress={toggleModal}>
        <IcSummarizeSpark name="Spark" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={toggleModal}>
        <View style={styles.Overlay}>
          <View style={styles.Content}>
            <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
              <IcPopUpExit name="close" />
            </TouchableOpacity>

            <Text style={styles.titleText}>
              Beromset 15 Triliun, ManadoPost Disrupsi
            </Text>

            <View style={styles.Description}>
              <Text style={styles.bulletPoint}>
                <Text style={styles.point}>• </Text>
                Politeknik Negeri Manado mengadakan Program Penerapan Iptek
                kepada Masyarakat (PIM) di Jemaat GMIM Paulus Kauditan.
              </Text>
              <Text style={styles.bulletPoint}>
                <Text style={styles.point}>• </Text>
                Desa Kauditan II, Kecamatan Kauditan, berupa pelatihan teknologi
                campuran beton untuk meningkatkan keterampilan tukang bangunan
                pada 29 September lalu.
              </Text>
              <Text style={styles.bulletPoint}>
                <Text style={styles.point}>• </Text>
                Ketua Tim Pelaksana, Syanne Pangemanan ST MEng, bersama anggota
                Helen G Mantiri SST MT dan Fery Sondakh ST MT, menyatakan bahwa
                kegiatan ini bertujuan untuk
              </Text>
              <Text style={styles.bulletPoint}>
                <Text style={styles.point}>• </Text>
                meningkatkan pengetahuan dan keterampilan tukang bangunan dalam
                memilih dan menggunakan material campuran beton, serta membantu
                dalam pembuatan gudang penyimpanan barang milik GMIM Paulus
                Kauditan.
              </Text>
            </View>

            {/* Tombol Play/Pause */}
            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playPauseButton}>
              {isPlaying ? <IcSumStop size={24} /> : <IcPopUpPlay size={24} />}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90,
    right: 30,
  },
  floatingButton: {
    backgroundColor: '#005AAC',
    borderRadius: 50,
    padding: 15,
    elevation: 10,
    shadowColor: '#0B7DE5',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 3.84,
  },
  Overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  Content: {
    width: '85%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'flex-start',
    position: 'relative',
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 30,
    color: '#000000',
    paddingLeft: 10,
  },
  Description: {
    marginBottom: 20,
    paddingLeft: 20,
  },
  bulletPoint: {
    fontSize: 14,
    marginBottom: 5,
  },
  playPauseButton: {
    alignSelf: 'center',
    borderRadius: 50,
    padding: 15,
    marginTop: 50,
  },
  point: {
    fontWeight: 'bold',
    color: 'black',
    size: 30,
  },
});

export default SummarizeFloatingButton;
