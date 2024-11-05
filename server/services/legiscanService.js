const fetch = require('node-fetch');
const config = require('../config/config');

class LegiscanService {
  constructor() {
    this.apiKey = config.legiscan.apiKey;
    this.baseUrl = config.legiscan.baseUrl;
  }

  async getOperationList(state = 'US') {
    const url = `${this.baseUrl}/?key=${this.apiKey}&op=getOperationList&state=${state}`;
    const response = await fetch(url);
    return response.json();
  }

  async getBill(billId) {
    const url = `${this.baseUrl}/?key=${this.apiKey}&op=getBill&id=${billId}`;
    const response = await fetch(url);
    return response.json();
  }

  async searchBills(query, state = 'US') {
    const url = `${this.baseUrl}/?key=${this.apiKey}&op=search&state=${state}&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    return response.json();
  }

  async getSessionList(state = 'US') {
    const url = `${this.baseUrl}/?key=${this.apiKey}&op=getSessionList&state=${state}`;
    const response = await fetch(url);
    return response.json();
  }

  async getOfficials() {
    const url = `${this.baseUrl}/?key=${this.apiKey}&op=getMasterList`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ERROR') {
      throw new Error(data.alert?.message || 'Failed to fetch officials data');
    }
    
    return this.transformOfficialsData(data);
  }

  async getOfficialVotes(officialId) {
    const url = `${this.baseUrl}/?key=${this.apiKey}&op=getRollCall&id=${officialId}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'ERROR') {
      throw new Error(data.alert?.message || 'Failed to fetch official votes');
    }
    
    return this.transformVotesData(data);
  }

  transformOfficialsData(data) {
    // Transform the raw API data into a more usable format
    return Object.values(data.masterlist || {}).map(official => ({
      id: official.people_id,
      name: `${official.firstname} ${official.lastname}`,
      role: official.role,
      state: official.state,
      party: official.party,
      district: official.district
    }));
  }

  transformVotesData(data) {
    // Transform the raw votes data into a more usable format
    return Object.values(data.rollcalls || {}).map(vote => ({
      roll_call_id: vote.roll_call_id,
      bill_title: vote.bill_title,
      vote_text: vote.vote_text,
      date: vote.date,
      description: vote.description
    }));
  }
}

module.exports = new LegiscanService();