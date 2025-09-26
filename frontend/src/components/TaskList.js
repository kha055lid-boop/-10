import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Chip, Grid,
  Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Alert
} from '@mui/material';
import { Add, CheckCircle, Schedule, Cancel } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const TaskList = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks/users/list');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
