import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, Box, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DonorList = () => {
  const { t } = useTranslation();
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await axios.get('/api/donors');
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const deleteDonor = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المتبرع؟')) {
      try {
        await axios.delete(`/api/donors/${id}`);
        fetchDonors();
      } catch (error) {
        console.error('Error deleting donor:', error);
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('donors')}
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        startIcon={<Add />}
        component={Link} 
        to="/add-donor"
        sx={{ mb: 2 }}
      >
        {t('addDonor')}
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('name')}</TableCell>
              <TableCell>{t('phone')}</TableCell>
              <TableCell>{t('donationType')}</TableCell>
              <TableCell>{t('amount')}</TableCell>
              <TableCell>{t('startDate')}</TableCell>
              <TableCell>{t('endDate')}</TableCell>
              <TableCell>{t('remainingDays')}</TableCell>
              <TableCell>{t('notes')}</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donors.map((donor) => (
              <TableRow key={donor.id}>
                <TableCell>{donor.name}</TableCell>
                <TableCell>{donor.phone}</TableCell>
                <TableCell>{donor.donation_type}</TableCell>
                <TableCell>{donor.amount}</TableCell>
                <TableCell>{donor.start_date}</TableCell>
                <TableCell>{donor.end_date}</TableCell>
                <TableCell>{donor.remaining_days}</TableCell>
                <TableCell>{donor.notes}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => deleteDonor(donor.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DonorList;
